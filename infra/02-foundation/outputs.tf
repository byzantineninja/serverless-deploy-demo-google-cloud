output "artifact_registry_url" {
  description = "Docker push/pull URL."
  value       = "${local.region}-docker.pkg.dev/${local.project_id}/${google_artifact_registry_repository.docker.repository_id}"
}

output "backend_service_name" {
  description = "Cloud Run service name for the backend."
  value       = local.backend_service_name
}

output "frontend_service_name" {
  description = "Cloud Run service name for the frontend."
  value       = local.frontend_service_name
}

output "backend_service_account_email" {
  description = "Service account email for the backend Cloud Run service."
  value       = google_service_account.backend.email
}

output "frontend_service_account_email" {
  description = "Service account email for the frontend Cloud Run service."
  value       = google_service_account.frontend.email
}

output "backend_mongodb_uri" {
  description = "MongoDB-compatible connection URI for the backend Firestore database (OIDC auth via service account)."
  value       = "mongodb://${google_firestore_database.backend.uid}.${google_firestore_database.backend.location_id}.firestore.goog:443/${google_firestore_database.backend.name}?loadBalanced=true&tls=true&retryWrites=false&authMechanism=MONGODB-OIDC&authMechanismProperties=ENVIRONMENT:gcp,TOKEN_RESOURCE:FIRESTORE"
}

output "firebase_api_key" {
  description = "Firebase Web API Key for the client-side Identity Platform SDK."
  value       = google_apikeys_key.firebase_web.key_string
  sensitive   = true
}

output "firebase_auth_domain" {
  description = "Firebase Auth domain for the client-side Identity Platform SDK."
  value       = "${local.project_id}.firebaseapp.com"
}

output "domain_name" {
  description = "Custom domain name for the Cloud Run frontend service."
  value       = var.domain_name
}

output "github_actions_service_account_email" {
  description = "GitHub Actions service account email. Add this as an Owner in Google Search Console for domain mapping."
  value       = local.github_actions_service_account_email
}
