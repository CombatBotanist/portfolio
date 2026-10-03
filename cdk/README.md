# Portfolio Infrastructure (CDK)

AWS CDK v2 (TypeScript) app that hosts the portfolio website and continuously
deploys it through a self-mutating CodePipeline.

Deploys to AWS account `911967969946` in `us-west-2`. DNS is managed in the
existing Route 53 hosted zone for `jguy.net`, and the site is served at
`portfolio.jguy.net`.

## Architecture

- **`bin/app.ts`** — creates the top-level `PipelineStack`.
- **`PipelineStack`** (`lib/pipeline.ts`) — a self-mutating `CodePipeline`
  sourced from GitHub (`CombatBotanist/portfolio`, `main`). Its build step
  compiles both the `website` and `cdk` packages and synthesizes the app.
  Deployment stages are added with `pipeline.addStage(...)`; only `Dev` exists
  today.
- **`DeployStage`** (`lib/stages/DeployStage.ts`) — one deployable stage made of
  three stacks:
  - **`HostedZoneStack`** — imports the existing `jguy.net` Route 53 zone.
  - **`CertificateStack`** — an ACM certificate for `portfolio.jguy.net`,
    created in `us-east-1` (required by CloudFront) with DNS validation.
  - **`WebsiteStack`** — the S3 bucket, CloudFront distribution, the A record
    alias, and a bucket deployment that uploads `../website/dist`.

## Prerequisites

- Node.js and npm.
- AWS credentials for the target account.
- The website must be built first (`cd ../website && npm run build`) so that
  `../website/dist` exists before synth/deploy of `WebsiteStack`.
- A Secrets Manager secret named `github/CombatBotanist/portfolio` holding the
  GitHub token the pipeline source uses.

This is the `@portfolio/cdk` workspace of the monorepo. Install dependencies
once from the repo root (`npm install` in `portfolio/`), not from here.

## Scripts

```bash
npm run build     # compile TypeScript to dist/ (tsc)
npm run watch     # compile on change (tsc -w)
npm run synth     # build, then synthesize the CloudFormation templates
npm run clean     # remove cdk.out and dist
```

## CDK commands

```bash
npx cdk synth     # emit the synthesized CloudFormation template
npx cdk diff      # compare deployed stacks with the current state
npx cdk deploy    # deploy to the configured account/region
```

The CDK app entry runs the compiled output — `cdk.json` sets `app` to
`node dist/bin/app.js`. A `tsc` build must therefore run before
`synth`/`deploy`; the `npm run synth` script and the pipeline both build first.
(`cdk diff`/`cdk deploy` invoked directly also need a prior `npm run build`.)

## Conventions

- One stack class per file in `lib/stacks/`, named `<Thing>Stack`.
- Each stack declares a `readonly` `*StackProps` interface extending
  `StackProps` and reads shared values through props.
- Cross-stack outputs are exposed as `public readonly` fields and passed down
  through stage/stack props rather than imported directly.
- Stacks consuming cross-region values set `crossRegionReferences: true`.

## Linting & Formatting

Linting and formatting use the Oxc toolchain
([oxlint](https://oxc.rs/docs/guide/usage/linter) +
[oxfmt](https://oxc.rs/docs/guide/usage/formatter)), configured once at the repo
root (`../.oxlintrc.json`, `../.oxfmtrc.json`) and run from there. This package's
`.oxlintrc.json` only extends the root baseline and disables `no-new` (CDK
constructs are instantiated for their side effect). Run `npm run lint` /
`npm run format` from the repo root.
