# Terraform Çıktıları (Outputs) - Güvenli Bulut Yayını
# Yalnızca güvenli meta veriler ve uç nokta kimlikleri dışa aktarılır.
# Asla şifre, gizli anahtar veya hassas belirteç basılmaz.

output "cloudflare_kv_namespace_id" {
  value       = cloudflare_workers_kv_namespace.pulse_aggregates.id
  description = "Agregasyon verilerinin tutulduğu Cloudflare KV Namespace ID"
}

output "cloudflare_worker_name" {
  value       = cloudflare_worker_script.pulse_edge_processor.name
  description = "Dağıtılan Cloudflare Edge Worker adı"
}

output "budget_alert_name" {
  value       = aws_budgets_budget.zero_cost_watchdog.name
  description = "0 TL maliyet koruması sağlayan AWS Bütçe Alarmı adı"
}

output "rate_limit_rule_id" {
  value       = cloudflare_rate_limit.api_protection.id
  description = "Aktif Cloudflare DDoS ve Hız Sınırlama kuralı kimliği"
}
