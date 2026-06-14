variable "project_id" {
  description = "Google Cloud 專案 ID。"
  type        = string
}

variable "region" {
  description = "Google Cloud 資源的預設區域。"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository 路徑，格式為 owner/repo。"
  type        = string
}

variable "tf_state_bucket" {
  description = "Terraform state 所在的 GCS bucket 名稱。"
  type        = string
}
