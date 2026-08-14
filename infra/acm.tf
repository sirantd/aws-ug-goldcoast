# DNS for this domain lives on Cloudflare, so Terraform cannot write the
# validation records itself. The flow is two-phase — see infra/README.md:
#
#   1. terraform apply -target=aws_acm_certificate.site
#   2. terraform output -json acm_validation_records   -> create in Cloudflare
#   3. terraform apply                                 -> waits, then builds CF

resource "aws_acm_certificate" "site" {
  provider = aws.us_east_1

  domain_name               = var.domain_name
  subject_alternative_names = local.certificate_sans
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "site" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_name]

  # The Cloudflare records are created by hand, but the one for the delegated
  # awsug.org.au subdomain is Terraform's own — without this edge nothing stops
  # the wait starting before that record exists.
  depends_on = [aws_route53_record.awsug_cert_validation]

  timeouts {
    # Long enough to add the CNAMEs in Cloudflare by hand without the apply
    # giving up first.
    create = "60m"
  }
}
