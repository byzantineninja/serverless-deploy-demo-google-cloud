data "terraform_remote_state" "bootstrap" {
  backend = "gcs"

  config = {
    bucket = var.tf_state_bucket
    prefix = var.bootstrap_state_prefix
  }
}

locals {
  project_id = data.terraform_remote_state.bootstrap.outputs.project_id
  region     = data.terraform_remote_state.bootstrap.outputs.region
}
