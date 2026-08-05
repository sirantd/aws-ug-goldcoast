data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

locals {
  # Bucket names are global, so suffix with the account id to stay unique
  # without needing a random suffix in state.
  bucket_name = "${var.project}-site-${data.aws_caller_identity.current.account_id}"
  log_bucket  = "${var.project}-logs-${data.aws_caller_identity.current.account_id}"

  aliases = concat([var.domain_name], var.subject_alternative_names)

  tags = {
    Project   = "aws-ug-goldcoast"
    ManagedBy = "terraform"
    Repo      = "sirantd/aws-ug-goldcoast"
  }
}
