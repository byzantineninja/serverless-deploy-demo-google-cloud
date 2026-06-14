terraform {
  backend "gcs" {
    prefix = "terraform/bootstrap"
  }
}
