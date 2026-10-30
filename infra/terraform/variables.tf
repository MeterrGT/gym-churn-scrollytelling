# Terraform Değişkenleri - Güvenli Bulut Yayını Altyapısı
# Öğrenci: Metehan Gezer (2516016026)

variable "project_name" {
  type        = string
  description = "Proje ve kaynak öneki"
  default     = "canli-sosyal-medya-nabzi"
}

variable "environment" {
  type        = string
  description = "Çalışma ortamı"
  default     = "production"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare Hesap Kimliği (Account ID)"
  default     = "dummy_cf_account_id_to_be_configured_by_owner"
  sensitive   = true
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare DNS Alan Adı Kimliği (Zone ID)"
  default     = "dummy_cf_zone_id_to_be_configured_by_owner"
  sensitive   = true
}

variable "notification_email" {
  type        = string
  description = "Bütçe ve güvenlik uyarılarının gönderileceği e-posta adresi"
  default     = "gztmetehan@gmail.com"
}

variable "monthly_budget_limit_usd" {
  type        = string
  description = "Aylık azami harcama sınırı (Hedef: 0 TRY / 0.01 USD tetikleyici)"
  default     = "0.01"
}

variable "vercel_project_id" {
  type        = string
  description = "Vercel proje tanımlayıcısı"
  default     = "prj_canli_sosyal_medya_nabzi"
}
