---
inclusion: fileMatch
fileMatchPattern: 'cdk/**'
---

# CDK Package (`cdk/`)

AWS CDK v2 app in TypeScript that hosts the portfolio website and deploys it
through a self-mutating pipeline. This is the `@portfolio/cdk` workspace of the
root npm-workspaces monorepo.

## Commands

Package-scoped commands run from inside `cdk/`:

```bash
npm run build     # tsc — compile to dist/
npm run watch     # tsc -w
npm run synth     # npm run build && npx cdk synth
npm run clean     # rm -rf cdk.out dist
npx cdk diff      # diff against the deployed stacks
npx cdk deploy    # deploy
```

Lint and format are configured once at the repo root and are normally run from
there (`npm run lint`, `npm run format` at `portfolio/`). Running `oxlint` /
`oxfmt` from inside `cdk/` also works — they pick up the hoisted binaries and
the nearest config.

The CDK app entry runs the **compiled** output: `cdk.json` sets
`app` to `node dist/bin/app.js`, so a `tsc` build must precede `synth`/`deploy`.
The `synth` script and the pipeline both build first. (The app previously ran
through `ts-node`, but the repo moved to TypeScript 7, which the pinned
`ts-node` cannot parse — running the compiled JS avoids that entirely.)

## Architecture

- `bin/app.ts` creates the single top-level `PipelineStack` targeting account
  `911967969946` / `us-west-2`.
- `PipelineStack` (`lib/pipeline.ts`) defines a self-mutating `CodePipeline`:
  - Source: GitHub `CombatBotanist/portfolio` `main`, authenticated with the
    Secrets Manager secret `github/CombatBotanist/portfolio`.
  - Synth runs `npm ci` then `npm run build` at the repo root (builds both
    workspaces, `website` then `cdk`), then `cdk synth` from `cdk/`, emitting to
    `cdk/cdk.out`.
  - Stages are added with `pipeline.addStage(new DeployStage(...))`. Only `Dev`
    exists today.
- `DeployStage` (`lib/stages/DeployStage.ts`) wires three stacks per stage and
  passes shared values (`stage`, `hostedZone`, `certificate`,
  `websiteSubdomain = 'portfolio'`) down through props.
- `HostedZoneStack` imports the existing `jguy.net` zone
  (`Z0843933BX943M8YM763`) — it does not create a zone.
- `CertificateStack` creates an ACM cert for `portfolio.jguy.net`, **forced to
  `us-east-1`** (CloudFront requirement) with DNS validation against the hosted
  zone.
- `WebsiteStack` creates the S3 bucket, CloudFront distribution, the A record
  alias, and a `BucketDeployment` sourced from `../website/dist`.

## Conventions

- One stack class per file in `lib/stacks/`, named `<Thing>Stack`.
- Each stack declares a `readonly` `*StackProps` interface extending
  `StackProps`.
- Expose cross-stack outputs as `public readonly` fields and pass them through
  props; do not import across stacks directly.
- Stacks that consume cross-region values (certificate in `us-east-1`) set
  `crossRegionReferences: true` on the `Stack` super call.
- Import from the granular `aws-cdk-lib/*` entry points (e.g.
  `aws-cdk-lib/core`, `aws-cdk-lib/aws-s3`) rather than the barrel.

## Linting & Formatting

Uses the Oxc toolchain, configured at the **repo root** (`../.oxfmtrc.json` and
`../.oxlintrc.json`); no ESLint or Prettier. `cdk/.oxlintrc.json` is a thin file
that `extends` the root baseline and adds the CDK-specific rule: `no-new` is
disabled because CDK relies on the side effect of constructing resources
(`new Bucket(...)`), which that rule otherwise flags. The formatter uses single
quotes. `cdk.out` and `dist` are excluded.

- The `website/dist` directory must exist (build the website first) before
  `synth`/`deploy` of `WebsiteStack` will succeed.
