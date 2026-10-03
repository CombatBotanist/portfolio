---
inclusion: fileMatch
fileMatchPattern: 'website/**'
---

# Website Package (`website/`)

React single-page app built with Vite and TanStack Router. This is the
`@portfolio/website` workspace of the root npm-workspaces monorepo; install
dependencies once from the repo root (`npm install` in `portfolio/`). Dev,
build, preview, and test commands run from inside `website/`.

## Stack

- React 19 with `react-dom`.
- TanStack Router (`@tanstack/react-router`) with **file-based routing** via the
  `@tanstack/router-plugin` Vite plugin (`autoCodeSplitting` enabled).
- Vite as the dev server and bundler.
- `react95` + `styled-components` for UI (Windows 95 styling). This is a plain
  SPA — there is no Tailwind and no TanStack Start server runtime.
- TanStack devtools are mounted in `__root.tsx` and wired via
  `@tanstack/devtools-vite`.

## Commands

```bash
npm run dev           # vite dev server on port 3000
npm run build         # production build to dist/
npm run preview       # preview the production build
npm run test          # vitest run (single pass, no watch)
```

Lint and format are configured once at the repo root and normally run from
there (`npm run lint`, `npm run format` at `portfolio/`). The package also keeps
`lint`/`format` scripts for linting just this workspace; they use the hoisted
binaries and the nearest config.

## Linting & Formatting

Uses the Oxc toolchain, configured at the **repo root** (`../.oxfmtrc.json` and
`../.oxlintrc.json`); no ESLint, Prettier, or Biome. The formatter uses single
quotes in both JS and JSX (`singleQuote` + `jsxSingleQuote`). `website/.oxlintrc.json`
is a thin file that `extends` the root baseline and adds the
react/typescript/unicorn/oxc/jsx-a11y/import plugins, the browser env, and
disables `react/react-in-jsx-scope` (the automatic JSX runtime makes the React
import unnecessary). `src/routeTree.gen.ts` is excluded from both tools.

## Routing

- Routes are files in `src/routes/`. Add a route by adding a file there; the
  router plugin regenerates `src/routeTree.gen.ts` automatically.
- Never hand-edit `src/routeTree.gen.ts` — it is generated.
- The root layout lives in `src/routes/__root.tsx` (renders `<Outlet />`).
- Use `createFileRoute('/path')({ component })` for leaf routes and
  `createRootRoute` for the root.
- Navigate with the `Link` component from `@tanstack/react-router`.

## Conventions

- TypeScript is strict (`strict`, `noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax`). Use type-only imports where required.
- Path aliases `#/*` and `@/*` both map to `./src/*`.
- The app mounts into the `#app` element (see `index.html` / `main.tsx`), not
  `#root`.
- The build output in `dist/` is what the CDK package deploys, so a successful
  `npm run build` is required before the infrastructure can ship new content.
