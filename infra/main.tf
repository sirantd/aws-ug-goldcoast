data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

locals {
  # Bucket names are global, so suffix with the account id to stay unique
  # without needing a random suffix in state.
  bucket_name = "${var.project}-site-${data.aws_caller_identity.current.account_id}"
  log_bucket  = "${var.project}-logs-${data.aws_caller_identity.current.account_id}"

  # The delegated awsug.org.au subdomain is a secondary name: it serves the
  # same content, and the pages carry a canonical tag pointing back at
  # var.domain_name, so search engines consolidate on the primary domain.
  # Gated because the certificate cannot be validated for this name until
  # awsug.org.au delegates the zone — see route53.tf.
  awsug_aliases = var.serve_awsug_subdomain ? [var.awsug_zone_name] : []

  certificate_sans = concat(var.subject_alternative_names, local.awsug_aliases)

  aliases = concat([var.domain_name], local.certificate_sans)

  tags = {
    Project   = "aws-ug-goldcoast"
    ManagedBy = "terraform"
    Repo      = "sirantd/aws-ug-goldcoast"
  }
}
