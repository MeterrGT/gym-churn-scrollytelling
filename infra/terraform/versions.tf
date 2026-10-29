terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.30.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.14.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40.0"
    }
  }

  # Güvenli state yönetimi: Hassas state verisi yerel şifrelenmiş veya remote S3/Terraform Cloud backend'de saklanır.
  # Local demo için backend tanımlanabilir.
}
