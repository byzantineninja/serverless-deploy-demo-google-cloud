output "project_id" {
  description = "GCP project ID。"
  value       = var.project_id
}

output "region" {
  description = "GCP region。"
  value       = var.region
}

output "github_repository" {
  description = "GitHub repository 路徑（owner/repo）。"
  value       = var.github_repository
}

# ---------------------------------------------------------------------------
# 輸出值 – 供 GitHub repository secrets 設定
# ---------------------------------------------------------------------------

output "tf_state_bucket" {
  description = "GitHub repository secrets 中的名稱為 `TF_STATE_BUCKET`。"
  value       = var.tf_state_bucket
}

output "wif_provider" {
  description = "GitHub repository secrets 中的名稱為 `WIF_PROVIDER`。"
  value       = google_iam_workload_identity_pool_provider.github_actions.name
}

output "wif_service_account" {
  description = "GitHub repository secrets 中的名稱為 `WIF_SERVICE_ACCOUNT`。"
  value       = google_service_account.github_actions.email
}
