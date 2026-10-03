# Portfolio

Personal portfolio for `jguy.net`, served at `portfolio.jguy.net`. This is an
npm-workspaces monorepo with two packages:

- **`website/`** (`@portfolio/website`) — the React single-page app (Vite +
  TanStack Router) that produces the static assets in `website/dist/`.
- **`cdk/`** (`@portfolio/cdk`) — the AWS CDK infrastructure that hosts the site
  (S3 + CloudFront + Route 53) and continuously deploys it via a self-mutating
  CodePipeline.

## Getting Started

Install all workspaces once from the repo root:

```bash
npm install
```

## Scripts (run from the repo root)

```bash
npm run build         # build website, then cdk (order matters)
npm run build:website # build only the website
npm run build:cdk     # build only the cdk package
npm run lint          # oxlint across the repo
npm run lint:fix      # oxlint --fix
npm run format        # oxfmt across the repo (writes)
npm run format:check  # oxfmt --check
npm run test          # run each workspace's test script, if present
npm run synth         # build the website, then build + synth the CDK app
```

Build order matters: the CDK `WebsiteStack` deploys `website/dist`, so the
website must be built before the CDK app is synthesized or deployed.

## Tooling

- **Linting/formatting:** the [Oxc](https://oxc.rs) toolchain (oxlint + oxfmt),
  configured once at the root (`.oxlintrc.json`, `.oxfmtrc.json`). Each package
  has a thin `.oxlintrc.json` that extends the root baseline. The formatter uses
  single quotes in both JS and JSX.
- **TypeScript:** each package keeps its own `tsconfig.json` (the website is a
  no-emit bundler config; the CDK package emits to `dist/`).

See each package's `README.md` for package-specific details, and
`.kiro/steering/` for the project's working notes.
