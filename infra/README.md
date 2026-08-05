# Infrastructure

S3 (private) → CloudFront (OAC) → `aws-ug-goldcoast.com.au`, with an IAM role that
GitHub Actions assumes over OIDC to publish. DNS is on Cloudflare, so the two DNS
steps below are manual.

```
                         ┌────────────────────────┐
  Cloudflare DNS ───────►│  CloudFront            │
  (proxy OFF)            │  · ACM cert us-east-1  │
                         │  · security headers    │
                         │  · rewrite-urls fn     │
                         └───────────┬────────────┘
                                     │ OAC (SigV4)
                         ┌───────────▼────────────┐
                         │  S3 (private, no ACLs) │
                         └────────────────────────┘
```

## What is here

| File | Contents |
| --- | --- |
| `s3.tf` | Content bucket: private, versioned, encrypted, CloudFront-only read |
| `cloudfront.tf` | Distribution, cache and security-header policies, URL-rewrite function |
| `acm.tf` | Certificate in us-east-1 with DNS validation |
| `github-oidc.tf` | OIDC provider and the deploy role, pinned to this repo and `main` |
| `functions/rewrite-urls.js` | Maps `/code-of-conduct` to `/code-of-conduct.html` |

## One-time setup

You need AWS credentials for the target account with permission to create S3, IAM,
ACM and CloudFront resources.

### 1. State bucket

Terraform's own state bucket has to exist first. Follow the commands in
`backend.hcl.example`, then:

```bash
cp backend.hcl.example backend.hcl        # fill in the bucket name
terraform init -backend-config=backend.hcl
```

### 2. Certificate, then DNS validation

CloudFront needs a validated certificate before it will accept the domain aliases, and
Terraform cannot write records into Cloudflare, so this is a two-phase apply.

```bash
terraform apply -target=aws_acm_certificate.site
terraform output -json acm_validation_records
```

Create each record in Cloudflare — **type CNAME, proxy status DNS only (grey cloud)**.
Proxying a validation record breaks it.

```bash
terraform apply          # waits for validation, then builds everything else
```

The wait has a 60-minute timeout; validation normally completes within a few minutes of
the records propagating.

### 3. Point the domain at CloudFront

```bash
terraform output cloudflare_site_records
```

Add those in Cloudflare, again with **proxy status DNS only**. Cloudflare's CNAME
flattening handles the apex record, so a `CNAME` at `aws-ug-goldcoast.com.au` is fine.

Leaving the proxy on would put Cloudflare's CDN in front of CloudFront's — two caches
to invalidate, doubled TLS termination, and CloudFront's real client IPs replaced by
Cloudflare's. Keep it off unless you have a specific reason.

Set Cloudflare's SSL/TLS mode to **Full (strict)**.

### 4. Wire up the deploy workflow

```bash
terraform output deploy_role_arn distribution_id bucket_name
```

Set them as **repository variables** (Settings → Secrets and variables → Actions →
Variables). They are not secrets — the role only trusts this repo's `main` branch.

```bash
gh variable set AWS_DEPLOY_ROLE_ARN --body "$(terraform output -raw deploy_role_arn)"
gh variable set AWS_REGION --body ap-southeast-2
gh variable set S3_BUCKET --body "$(terraform output -raw bucket_name)"
gh variable set CLOUDFRONT_DISTRIBUTION_ID --body "$(terraform output -raw distribution_id)"
```

The workflow targets a `production` GitHub environment. Create it if you want a manual
approval gate on deploys; otherwise the job runs unattended.

### 5. First deploy

Push to `main`, or run the Deploy workflow manually. Before DNS is cut over you can
check the result on the CloudFront hostname from
`terraform output distribution_domain_name`.

## Notes

**Price class.** `PriceClass_All` is the default because it is the only class that
includes Australian edge locations, and that is where nearly all of this site's traffic
comes from.

**Caching.** Fingerprinted assets under `_astro/` are uploaded `immutable` for a year.
HTML is uploaded with `max-age=300, must-revalidate` and the whole distribution is
invalidated on every deploy, so a content change is visible within a minute or two.

**Access logs** are off by default (`enable_access_logs = false`) to keep the running
cost at roughly the price of the Route 53-free DNS and a few cents of storage. Turn
them on when you need traffic numbers.

**Deleting objects.** The bucket is versioned with a 30-day non-current expiry, so a
bad sync is recoverable. The deploy workflow deliberately does not prune old `_astro/`
objects — a visitor mid-navigation may still be fetching assets from the previous
build. To clean them up occasionally:

```bash
aws s3 sync dist/ "s3://$(terraform output -raw bucket_name)/" \
  --delete --size-only --exclude '*' --include '_astro/*'
```

**Teardown.** `terraform destroy` fails while the bucket has objects — empty it first
with `aws s3 rm s3://<bucket> --recursive`, and note that versioned objects need
`--recursive` on each version or a lifecycle sweep.
