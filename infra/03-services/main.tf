data "google_cloud_run_v2_service" "backend" {
  name     = local.backend_service_name
  location = local.region
  project  = local.project_id
}

data "google_cloud_run_v2_service" "frontend" {
  name     = local.frontend_service_name
  location = local.region
  project  = local.project_id
}

# 公開存取 Cloud Run 服務
resource "google_cloud_run_v2_service_iam_member" "frontend_public_access" {
  name   = local.frontend_service_name
  role   = "roles/run.invoker"
  member = "allUsers"
}

# 允許前端服務帳戶呼叫後端服務
resource "google_cloud_run_v2_service_iam_member" "backend_frontend_access" {
  name   = local.backend_service_name
  role   = "roles/run.invoker"
  member = "serviceAccount:${local.frontend_service_account_email}"
}

# 將自訂網域映射到前端 Cloud Run 服務
resource "google_cloud_run_domain_mapping" "frontend_mapping" {
  name     = local.domain_name
  location = data.google_cloud_run_v2_service.frontend.location

  metadata {
    namespace = local.project_id
  }

  spec {
    route_name = data.google_cloud_run_v2_service.frontend.name
  }

  depends_on = [data.google_cloud_run_v2_service.frontend]
}
