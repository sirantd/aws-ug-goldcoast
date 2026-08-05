variable "region" {
  description = "Region for the content bucket. CloudFront and ACM are global / us-east-1 regardless."
  type        = string
  default     = "ap-southeast-2"
}

variable "project" {
  description = "Short name used to prefix resource names and tags."
  type        = string
  default     = "aws-ug-goldcoast"
}

variable "domain_name" {
  description = "Apex domain the site is served from."
  type        = string
  default     = "aws-ug-goldcoast.com.au"
}

variable "subject_alternative_names" {
  description = "Extra names on the certificate and CloudFront distribution, e.g. the www host."
  type        = list(string)
  default     = ["www.aws-ug-goldcoast.com.au"]
}

variable "price_class" {
  description = <<-EOT
    CloudFront price class. PriceClass_All is the only class that includes the
    Australian edge locations, which is where essentially all of this site's
    traffic originates — the saving from a cheaper class is not worth the extra
    latency for local visitors.
  EOT
  type        = string
  default     = "PriceClass_All"

  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.price_class)
    error_message = "price_class must be PriceClass_All, PriceClass_200 or PriceClass_100."
  }
}

variable "github_repository" {
  description = "owner/name of the GitHub repo allowed to assume the deploy role."
  type        = string
  default     = "sirantd/aws-ug-goldcoast"
}

variable "github_deploy_ref" {
  description = "Git ref whose workflow runs may deploy. Keep this pinned to the default branch."
  type        = string
  default     = "refs/heads/main"
}

variable "github_owner_id" {
  description = <<-EOT
    Numeric GitHub account id of the repository owner, from
    `gh api repos/OWNER/NAME --jq .owner.id`. Used to build the immutable OIDC
    subject claim; leave null to trust only the plain (rename-sensitive) form.
  EOT
  type        = number
  default     = 15087953
}

variable "github_repository_id" {
  description = "Numeric GitHub repository id, from `gh api repos/OWNER/NAME --jq .id`."
  type        = number
  default     = 1323494502
}

variable "github_environment" {
  description = <<-EOT
    GitHub environment the deploy job runs in. This is part of the OIDC subject
    claim — a job declaring `environment: X` gets sub `repo:owner/name:environment:X`
    rather than the `ref:` form — so it must match the workflow.
  EOT
  type        = string
  default     = "production"
}

variable "create_github_oidc_provider" {
  description = <<-EOT
    Create the GitHub Actions OIDC provider in this account. Set to false if the
    account already has one (only a single provider per issuer URL is allowed).
  EOT
  type        = bool
  default     = true
}

variable "enable_access_logs" {
  description = "Ship CloudFront standard access logs to a dedicated bucket. Off by default to keep running cost at ~zero."
  type        = bool
  default     = false
}

variable "log_retention_days" {
  description = "Days to keep CloudFront access logs when enable_access_logs is true."
  type        = number
  default     = 90
}
