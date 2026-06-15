data "terraform_remote_state" "bootstrap" {
  backend = "gcs"

  config = {
    bucket = var.tf_state_bucket
    prefix = var.bootstrap_state_prefix
  }
}

locals {
  project_id                           = data.terraform_remote_state.bootstrap.outputs.project_id
  region                               = data.terraform_remote_state.bootstrap.outputs.region
  github_actions_service_account_email = data.terraform_remote_state.bootstrap.outputs.wif_service_account
  artifact_registry_repository_id      = "docker-repo"
  backend_service_name                 = "backend"
  frontend_service_name                = "frontend"
}
