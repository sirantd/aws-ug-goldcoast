# Public hosted zone for the subdomain delegated to us from awsug.org.au, the
# national AWS User Group domain. We do not control the parent zone, so the
# delegation is one-directional: creating this zone mints a name server set,
# and the awsug.org.au administrator has to add the matching NS records on
# their side before anything here resolves.
#
# The zone starts empty apart from the SOA and NS records Route53 creates with
# it. The site still serves from aws-ug-goldcoast.com.au via Cloudflare — see
# acm.tf and cloudfront.tf.

resource "aws_route53_zone" "awsug" {
  name    = var.awsug_zone_name
  comment = "AWS User Group Gold Coast — subdomain delegated from awsug.org.au"
}

# --- Serving the site on the delegated name ---------------------------------
# Everything below is inert until var.serve_awsug_subdomain is true. Flip it
# only once `dig NS goldcoast.awsug.org.au` answers from the public root — ACM
# validates by resolving the record from outside, so an undelegated zone means
# a certificate that never leaves PENDING_VALIDATION.

# Unlike the Cloudflare-hosted primary domain, this zone is ours, so Terraform
# writes the validation record itself rather than handing it to a human.
resource "aws_route53_record" "awsug_cert_validation" {
  for_each = {
    for option in aws_acm_certificate.site.domain_validation_options :
    option.domain_name => option
    if option.domain_name == var.awsug_zone_name
  }

  zone_id = aws_route53_zone.awsug.zone_id
  name    = each.value.resource_record_name
  type    = each.value.resource_record_type
  records = [each.value.resource_record_value]
  ttl     = 60

  # ACM reuses the same validation token when a certificate is reissued for a
  # name it has already seen, so a re-request writes an identical record.
  allow_overwrite = true
}

# Alias rather than CNAME: the apex of this zone also holds the SOA and NS
# records, which a CNAME may not coexist with.
resource "aws_route53_record" "awsug_site" {
  for_each = var.serve_awsug_subdomain ? toset(["A", "AAAA"]) : toset([])

  zone_id = aws_route53_zone.awsug.zone_id
  name    = var.awsug_zone_name
  type    = each.value

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
