terraform {
  backend "gcs" {
    prefix = "terraform/foundation"
  }
}
