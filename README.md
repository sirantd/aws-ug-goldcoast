# AWS User Group Gold Coast

Website for the [AWS User Group Gold Coast](https://aws-ug-goldcoast.com.au) — a free
monthly meetup for people building on AWS.

Astro static site, served from S3 behind CloudFront. Push to `main` deploys.

```
src/content/     events and news — the files organisers edit most
src/data/        site constants, channels, organisers
src/components/  page sections
infra/           Terraform for S3 + CloudFront + ACM + the deploy role
docs/            how to update content and how the deployment works
```

## Local development

Requires Node 22+.

```bash
npm install
npm run dev      # http://localhost:4321
```

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run images` | Regenerate `public/og.png` and the touch icon |

Draft events and news (`draft: true`) show in `dev` and are excluded from builds.

## Updating the site

Adding a meetup is one Markdown file. See **[docs/CONTENT.md](docs/CONTENT.md)** for
events, news, organisers, photos and the newsletter form.

## Deploying

`main` is deployed automatically by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): build → sync to S3 →
invalidate CloudFront. It authenticates with GitHub OIDC, so there are no AWS keys in
the repository.

First-time infrastructure setup, including the Cloudflare DNS records, is in
**[infra/README.md](infra/README.md)**.

## Licence

Site content © AWS User Group Gold Coast. Code is MIT — see [LICENSE](LICENSE).

Community-run. Not affiliated with Amazon Web Services, Inc.
