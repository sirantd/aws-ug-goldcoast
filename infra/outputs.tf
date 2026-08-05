output "bucket_name" {
  description = "Content bucket the build output is synced into."
  value       = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "CloudFront distribution id, used for cache invalidation."
  value       = aws_cloudfront_distribution.site.id
}

output "distribution_domain_name" {
  description = "CloudFront hostname. Point the Cloudflare records here, and use it to preview before DNS is cut over."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "deploy_role_arn" {
  description = "Role for the GitHub Actions workflow. Set as the AWS_DEPLOY_ROLE_ARN repository variable."
  value       = aws_iam_role.deploy.arn
}

output "acm_validation_records" {
  description = "DNS records to create in Cloudflare (proxy off) to validate the certificate."
  value = [
    for option in aws_acm_certificate.site.domain_validation_options : {
      name  = option.resource_record_name
      type  = option.resource_record_type
      value = option.resource_record_value
    }
  ]
}

output "cloudflare_site_records" {
  description = "DNS records to create in Cloudflare (proxy off) so the domain serves the site."
  value = [
    for alias in local.aliases : {
      name  = alias
      type  = "CNAME"
      value = aws_cloudfront_distribution.site.domain_name
    }
  ]
}
