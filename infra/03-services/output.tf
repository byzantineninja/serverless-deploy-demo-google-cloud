output "manual_dns_records" {
  description = "DNS records to create manually on your existing DNS provider"
  value = {
    domain_name = local.domain_name
    resource_records = [
      for rr in google_cloud_run_domain_mapping.frontend_mapping.status[0].resource_records : {
        name    = rr.name
        type    = rr.type
        ttl     = 300
        rrdatas = [rr.rrdata]
      }
    ]
  }
}
