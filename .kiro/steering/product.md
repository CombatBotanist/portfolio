---
inclusion: always
---

# Product Overview

This is a personal portfolio project for the domain `jguy.net`. The site is served
from the `portfolio.jguy.net` subdomain.

The repository is a monorepo with two independent npm packages:

- `website/` — the React single-page application that visitors see.
- `cdk/` — the AWS CDK infrastructure that builds, hosts, and continuously deploys
  the website.

## How the pieces fit together

1. The `website` package is built with Vite into static assets (`website/dist`).
2. The `cdk` package provisions an S3 bucket + CloudFront distribution and uploads
   the built assets from `../website/dist` to that bucket.
3. A self-mutating CodePipeline (sourced from GitHub `CombatBotanist/portfolio`,
   `main` branch) rebuilds both packages and redeploys on every push.

## Deployment target

- AWS account `911967969946`, primary region `us-west-2`.
- ACM certificates live in `us-east-1` (required for CloudFront) via
  cross-region references.
- DNS is managed in the existing Route 53 hosted zone for `jguy.net`
  (`Z0843933BX943M8YM763`).

Only a `Dev` stage exists today. Additional stages are added by calling
`pipeline.addStage(new DeployStage(...))` in `cdk/lib/pipeline.ts`.
