variable "tf_state_bucket" {
  description = "用於儲存 Terraform 狀態的 GCS bucket 名稱。"
  type        = string
}

variable "bootstrap_state_prefix" {
  description = "用於儲存 bootstrap 階段 Terraform 狀態的 GCS 路徑前綴。"
  type        = string
  default     = "terraform/bootstrap"
}

variable "domain_name" {
  description = "用於設定 Cloud Run 前端服務的自訂網域名稱。"
  type        = string
}
