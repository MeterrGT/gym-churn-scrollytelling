# Altyapı Olarak Kod (IaC) - Güvenli Bulut Yayını
# Proje: Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)
# Öğrenci: Metehan Gezer (Öğrenci No: 2516016026)
# Hedef Maliyet: 0 TRY (Ücretsiz katman sınırları ile kısıtlanmıştır)

# ------------------------------------------------------------------------------
# 1. Cloudflare Workers KV - Yalnızca Agregasyon Verisi (Zero-Retention)
# ------------------------------------------------------------------------------
resource "cloudflare_workers_kv_namespace" "pulse_aggregates" {
  account_id = var.cloudflare_account_id
  title      = "${var.project_name}-aggregates-${var.environment}"
}

# ------------------------------------------------------------------------------
# 2. Cloudflare Worker Script - Edge Stream Processor
# ------------------------------------------------------------------------------
resource "cloudflare_worker_script" "pulse_edge_processor" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}-processor"
  content    = file("${path.module}/../cloudflare-worker/src/index.ts")
  module     = true

  kv_namespace_binding {
    name         = "PULSE_AGGREGATES_KV"
    namespace_id = cloudflare_workers_kv_namespace.pulse_aggregates.id
  }

  plain_text_binding {
    name = "ENVIRONMENT"
    text = var.environment
  }

  plain_text_binding {
    name = "MAX_WINDOW_MINUTES"
    text = "60"
  }

  plain_text_binding {
    name = "ALLOWED_ORIGIN"
    text = "https://metehan-gezer.vercel.app"
  }
}

# ------------------------------------------------------------------------------
# 3. Cloudflare Rate Limiting - DDoS & API Kötüye Kullanım Koruması
# ------------------------------------------------------------------------------
resource "cloudflare_rate_limit" "api_protection" {
  zone_id   = var.cloudflare_zone_id
  threshold = 100
  period    = 60

  match {
    request {
      url_pattern = "*metehan-gezer.vercel.app/api/*"
      schemes     = ["HTTPS"]
      methods     = ["GET", "POST"]
    }
    response {
      statuses = [200, 201, 202, 301, 302, 400, 404]
    }
  }

  action {
    mode    = "simulate"
    timeout = 300
    response {
      content_type = "application/json"
      body         = "{\"error\": \"Çok fazla istek yapıldı. Lütfen daha sonra tekrar deneyin.\", \"code\": \"RATE_LIMIT_EXCEEDED\"}"
    }
  }

  disabled    = false
  description = "Dakika başına 100 isteği aşan IP adreslerini sınırla"
}

# ------------------------------------------------------------------------------
# 4. AWS 0 TL / 0.01 USD Bütçe ve Harcama Alarmı
# AWS Ücretsiz Katman limit aşımı durumunda e-posta bildirimi tetikler
# ------------------------------------------------------------------------------
resource "aws_budgets_budget" "zero_cost_watchdog" {
  name              = "${var.project_name}-zero-cost-watchdog"
  budget_type       = "COST"
  limit_amount      = var.monthly_budget_limit_usd
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2026-01-01_00:00"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.notification_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.notification_email]
  }
}

# ------------------------------------------------------------------------------
# 5. Vercel En Az Yetkili Ortam Değişkenleri Bağlantısı
# ------------------------------------------------------------------------------
resource "vercel_project_environment_variable" "security_txt_contact" {
  project_id = var.vercel_project_id
  key        = "NEXT_PUBLIC_SECURITY_CONTACT"
  value      = "mailto:gztmetehan@gmail.com"
  target     = ["production", "preview", "development"]
}
