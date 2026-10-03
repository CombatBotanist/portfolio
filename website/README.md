# Portfolio Website

The React single-page application for the personal portfolio at
`portfolio.jguy.net`. Built with [Vite](https://vite.dev/) and
[TanStack Router](https://tanstack.com/router) using file-based routing.

This package produces the static assets in `dist/` that the `../cdk` package
deploys to S3 + CloudFront.

## Stack

- [React 19](https://react.dev/)
- [TanStack Router](https://tanstack.com/router) — file-based routing via the
  router Vite plugin (code splitting enabled)
- [Vite](https://vite.dev/) — dev server and bundler
- [react95](https://react95.io/) + [styled-components](https://styled-components.com/)
  for the UI

This is a plain client-side SPA. There is no TanStack Start server runtime, no
Tailwind, and no API/server functions.

This is the `@portfolio/website` workspace of the monorepo.

## Getting Started

Install dependencies once from the repo root, then start the dev server here:

```bash
npm install          # run in the repo root (portfolio/)
npm run dev          # run in website/
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev           # start the Vite dev server on port 3000
npm run build         # production build to dist/
npm run preview       # preview the production build locally
npm run test          # run the Vitest suite once
npm run lint          # lint with oxlint
npm run lint:fix      # lint and apply autofixes
npm run format        # format with oxfmt
npm run format:check  # check formatting without writing
```

## Linting & Formatting

Linting and formatting use the Oxc toolchain
([oxlint](https://oxc.rs/docs/guide/usage/linter) +
[oxfmt](https://oxc.rs/docs/guide/usage/formatter)), configured once at the repo
root (`../.oxlintrc.json`, `../.oxfmtrc.json`) and normally run from there. This
package's `.oxlintrc.json` extends the root baseline with the React/JSX plugins.
The formatter uses single quotes for both JS and JSX, and the generated
`src/routeTree.gen.ts` is excluded from both tools.

## Routing

Routes are files in `src/routes/`. To add a route, add a file there — the
TanStack Router plugin regenerates `src/routeTree.gen.ts` automatically.

- `src/routes/__root.tsx` is the root layout (renders `<Outlet />`).
- Use `createFileRoute('/path')({ component })` for leaf routes.
- Navigate between routes with the `Link` component from
  `@tanstack/react-router`.

Do not hand-edit `src/routeTree.gen.ts`; it is generated.

## Project Layout

```
src/
├── main.tsx            app entry — mounts RouterProvider on #app
├── router.tsx          createRouter helper + router type registration
├── routeTree.gen.ts    GENERATED — do not edit
├── styles.css          global styles
├── components/         shared components
└── routes/             file-based routes
```

## Notes

- TypeScript is strict; path aliases `#/*` and `@/*` both resolve to `./src/*`.
- The app mounts into the `#app` element (see `index.html`).
- A successful `npm run build` is required before the `cdk` package can deploy
  updated content, since it ships `dist/`.
