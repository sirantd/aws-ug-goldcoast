# ---------------------------------------------------------------------------
# GitHub Actions deploys via OIDC — no long-lived access keys in the repo.
# ---------------------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC endpoint uses a certificate chained to a well-known root, and
  # IAM no longer validates this list. Kept because the argument is required.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_github_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  github_oidc_arn = var.create_github_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn

  github_owner = split("/", var.github_repository)[0]
  github_name  = split("/", var.github_repository)[1]

  oidc_subject_plain     = "repo:${var.github_repository}:environment:${var.github_environment}"
  oidc_subject_immutable = "repo:${local.github_owner}@${var.github_owner_id}/${local.github_name}@${var.github_repository_id}:environment:${var.github_environment}"

  oidc_subjects = var.github_owner_id == null || var.github_repository_id == null ? [local.oidc_subject_plain] : [local.oidc_subject_plain, local.oidc_subject_immutable]
}

data "aws_iam_policy_document" "deploy_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.github_oidc_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Two things shape this subject, and both were learned the hard way:
    #
    # 1. The deploy job declares `environment: production`, so GitHub issues
    #    `…:environment:NAME`. The `ref:` form is never sent for such a job.
    # 2. This repo gets the *immutable* subject claim, which embeds the numeric
    #    owner and repository ids so the trust survives (and is not fooled by) a
    #    rename: `repo:owner@OWNER_ID/name@REPO_ID:environment:NAME`.
    #
    # Both forms are listed because StringEquals ORs its values — the plain form
    # is what an org sees with the immutable claim turned off, so this keeps
    # working either way.
    #
    # The branch cannot be pinned here: only `aud`, `sub` and `amr` are mapped
    # from an OIDC token into the IAM request context, so a condition on `:ref`
    # or `:repository` matches nothing and denies everything. That restriction
    # lives on the GitHub environment's deployment branch policy (`main` only).
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.oidc_subjects
    }
  }
}

data "aws_iam_policy_document" "deploy" {
  statement {
    sid = "SyncSiteObjects"

    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:GetObject",
    ]

    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  statement {
    sid = "ListSiteBucket"

    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
    ]

    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid       = "InvalidateCache"
    actions   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
    resources = [aws_cloudfront_distribution.site.arn]
  }
}

resource "aws_iam_role" "deploy" {
  name                 = "${var.project}-github-deploy"
  description          = "Assumed by GitHub Actions to publish the ${var.project} site"
  assume_role_policy   = data.aws_iam_policy_document.deploy_assume_role.json
  max_session_duration = 3600
}

resource "aws_iam_role_policy" "deploy" {
  name   = "publish-site"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy.json
}
