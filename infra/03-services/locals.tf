data "terraform_remote_state" "bootstrap" {
  backend = "gcs"

  config = {
    bucket = var.tf_state_bucket
    prefix = var.bootstrap_state_prefix
  }
}

data "terraform_remote_state" "foundation" {
  backend = "gcs"

  config = {
    bucket = var.tf_state_bucket
    prefix = var.foundation_state_prefix
  }
}

locals {
  project_id                     = data.terraform_remote_state.bootstrap.outputs.project_id
  region                         = data.terraform_remote_state.bootstrap.outputs.region
  backend_service_name           = data.terraform_remote_state.foundation.outputs.backend_service_name
  frontend_service_name          = data.terraform_remote_state.foundation.outputs.frontend_service_name
  frontend_service_account_email = data.terraform_remote_state.foundation.outputs.frontend_service_account_email
  domain_name                    = data.terraform_remote_state.foundation.outputs.domain_name
}
