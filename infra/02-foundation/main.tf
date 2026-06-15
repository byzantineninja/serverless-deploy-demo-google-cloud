resource "google_project_service" "apis" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebase.googleapis.com",
    "run.googleapis.com",
    "apikeys.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

resource "google_service_account" "backend" {
  account_id   = "${local.backend_service_name}-sa"
  display_name = "Backend Service Account"

  depends_on = [google_project_service.apis]
}

resource "google_service_account" "frontend" {
  account_id   = "${local.frontend_service_name}-sa"
  display_name = "Frontend Service Account"

  depends_on = [google_project_service.apis]
}

resource "google_service_account_iam_member" "github_actions_backend_sa_user" {
  service_account_id = google_service_account.backend.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${local.github_actions_service_account_email}"
}

resource "google_service_account_iam_member" "github_actions_frontend_sa_user" {
  service_account_id = google_service_account.frontend.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${local.github_actions_service_account_email}"
}

resource "google_artifact_registry_repository" "docker" {
  repository_id = local.artifact_registry_repository_id
  description   = "Docker container image repository"
  format        = "DOCKER"

  depends_on = [google_project_service.apis]
}

resource "google_artifact_registry_repository_iam_member" "cloud_run_backend_reader" {
  location   = local.region
  repository = google_artifact_registry_repository.docker.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.backend.email}"
}

resource "google_artifact_registry_repository_iam_member" "cloud_run_frontend_reader" {
  location   = local.region
  repository = google_artifact_registry_repository.docker.repository_id
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.frontend.email}"
}

resource "google_firestore_database" "backend" {
  name                                = "${local.backend_service_name}-db"
  location_id                         = local.region
  type                                = "FIRESTORE_NATIVE"
  database_edition                    = "ENTERPRISE"
  mongodb_compatible_data_access_mode = "DATA_ACCESS_MODE_ENABLED"

  depends_on = [google_project_service.apis]
}

resource "google_project_iam_member" "cloud_run_backend_firestore" {
  project = local.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.backend.email}"
  condition {
    title       = "Only access specific database"
    description = "Only allow access to the specific Firestore database"
    expression  = "resource.name == 'projects/${local.project_id}/databases/${google_firestore_database.backend.name}' || resource.name.startsWith('projects/${local.project_id}/databases/${google_firestore_database.backend.name}/documents/')"
  }
}

resource "google_firebase_project" "default" {
  provider = google-beta

  depends_on = [google_project_service.apis]
}

resource "google_identity_platform_config" "default" {
  sign_in {
    email {
      enabled           = true
      password_required = false
    }

    allow_duplicate_emails = false
  }

  authorized_domains = [
    var.domain_name,
  ]

  depends_on = [google_firebase_project.default]
}

resource "google_apikeys_key" "firebase_web" {
  name         = "firebase-web-key"
  display_name = "Firebase Web API Key"

  restrictions {
    api_targets {
      service = "identitytoolkit.googleapis.com"
    }
    api_targets {
      service = "securetoken.googleapis.com"
    }
  }

  depends_on = [google_firebase_project.default]
}
