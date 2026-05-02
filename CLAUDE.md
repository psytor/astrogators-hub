# CLAUDE.md — astrogators-hub

Guide for Claude Code when working inside this submodule.

## Scope rule (read first)

This is a **submodule**. Everything you change must stay inside
`astrogators-hub/`. Do not edit, read as authoritative, or make assumptions
based on sibling submodules (`astrogators-table`, `mod-ledger`,
`mod-ledger-ui`, `astrogators-shared-ui`, `nightwatcher`) or the parent
`astro-table/` workspace root. If a task seems to require changes outside this
folder, stop and ask first.

The submodule boundary exists to contain AI blast radius: one session working
here must not ripple into sibling services.

## What this service is

React 19 + Vite 8 + TypeScript 6 single-page app. It is the **landing page
and auth UI** for the Astrogator's Table ecosystem:

- Home page listing the apps in the ecosystem and linking to them
- Login, register, forgot/reset password, verify email
- Authenticated profile management (incl. ally-code CRUD)

It consumes:

- **`astrogators-shared-ui`** (npm package, `^0.6.0`) — shared components,
  `AuthProvider`, API client, auth/ally-code storage helpers
- **`astrogators-table`** backend — all auth and ally-code endpoints. URL
  comes from `VITE_ASTROGATORS_TABLE_URL` at build time

It does not own any persistent state. All state lives in the backend or
browser storage (handled by shared-ui).

## Single-origin rule (read before touching URLs)

The hub, `mod-ledger-ui`, and both backends are served from **one origin**
in both dev and prod — `http://localhost/` in dev, `https://astrotable.dynv6.net/`
in prod. The workspace nginx reverse proxy (at the workspace root, not in
this submodule) fronts every request and dumb-proxies each prefix to the
right backend or frontend.

**Every `VITE_*_URL` must point through that proxy.** Never direct-port
(e.g. `http://localhost:8000/...`) — that breaks auth-state sharing
(localStorage is scoped per origin, and `:8000` is a different origin from
`:80`), forces CORS, and turns cross-app navigation into cross-origin
redirects that look like a logged-out state.

## Stack

- Node **24** (pinned via `.nvmrc` and `engines`)
- npm (lockfile committed)
- React **19.2**, react-dom **19.2**
- React Router **7** (declarative `<Routes>` / `<Route>` API — data APIs not used)
- Vite **8**, `@vitejs/plugin-react` **6**
- TypeScript **6**
- `lucide-react` **1.x** for icons

## Common commands

```bash
# Make sure Node 24 is active
nvm use

# Install / update deps
npm install
npm install <pkg>
npm install -D <pkg>

# Run the dev server (hot reload, port 5173)
npm run dev

# Production build (outputs to ./dist)
npm run build

# Preview the production build locally
npm run preview

# Type-check without emitting
npm run type-check

# Build + run in Docker
docker compose -f docker/docker-compose.yml --env-file .env up -d --build
```

## Tone rule (READ BEFORE WRITING ANY USER-FACING COPY)

This is **not a marketing site**. It is a hub: a list of apps the user
can open, plus auth. The audience is the owner and a small group of
known users — they already know what's here. Do not write to a stranger
you're trying to convert.

Hard rules — these have been violated before and the result was awful:

- **No sales copy.** Do not write taglines, value propositions, or
  flattering adjectives. App descriptions are one factual sentence about
  what the app does. "Audits SWGOH guild tickets nightly" — not "Quiet,
  roster-aware ticket auditing built for officers who care."
- **No invented status indicators.** Never add an "Online" / "Live" /
  "Healthy" / "Beta" / "New" badge unless wired to a real signal. The
  apps in this hub are not interconnected for health checks. A green dot
  that always says "Online" is a lie.
- **No invented metrics.** No user counts, uptime numbers, "trusted by N
  guilds", "1000+ audits/night", etc. We don't measure these and we are
  not going to fake them.
- **No padded feature lists.** If an app has two real features, list
  two. Do not pad to three or five for visual symmetry. Do not paraphrase
  the same feature into multiple bullets.
- **No comparative claims.** "Faster than…", "the easiest way to…", "the
  only tool that…" — none of this. Even if true, it's not the hub's job
  to argue.
- **Borrow facts from each app's own docs.** If you're describing
  Nightwatcher, the source of truth is `nightwatcher/docs/ADMIN_GUIDE.md`
  and that submodule's `CLAUDE.md`. Don't invent capabilities the app
  doesn't have.

If a section feels empty after applying these rules, leave it empty or
delete the section. An honest empty space is better than filler.

## Critical rules

**Vite build-time env var inlining.** Any value used in the bundle must come
through an `import.meta.env.VITE_*` variable. Changing `.env` requires a
rebuild — Vite bakes the value into the JS at build time, not at runtime. The
Docker build takes them via `--build-arg` (wired up in `docker-compose.yml`).

**Never introduce Docker network coupling to other compose projects.** This
service runs with `network_mode: host` and listens on `localhost:4173`.
The workspace nginx at `../nginx/` is the single front door — it's what the
browser actually talks to, and it proxies the hub at `/` and the backends at
their prefixes. Never suggest `networks: external: true` or joining another
compose's network.

**Auth + API access goes through `astrogators-shared-ui`.** Do not add a
second API client, a second auth context, or bespoke JWT handling. If the
shared lib is missing something, extend it there and cut a new shared-ui
release — do not reimplement.

**Routes are declarative.** This app uses `<Routes>` / `<Route>` /
`<Navigate>` from `react-router-dom@7`, not the data-router APIs
(`createBrowserRouter`, loaders, actions). If you need loaders/actions, raise
it as a deliberate architecture change.

**Hub is mounted at the root path in production.** The Vite `base` default
(`/`) is correct. Do not set `base: '/hub/'` or similar unless the deployment
URL changes.

## Configuration

`.env` at the repo root is loaded automatically by Vite. **`.env` is
gitignored** — only `.env.example` is committed. When adding a new setting,
update both `.env.example` and any consumer (`main.tsx`, pages) together.

Current vars:

- `VITE_ASTROGATORS_TABLE_URL` — full URL including the backend's
  `SERVICE_PREFIX`, routed through the workspace nginx. Dev:
  `http://localhost/astrogators-table`. Prod:
  `https://astrotable.dynv6.net/astrogators-table`.

## When adding dependencies

Use `npm install` (not yarn/pnpm). Commit both `package.json` and
`package-lock.json`. Rebuild the Docker image after dependency changes.

If the dep is shared logic that would benefit `mod-ledger-ui` too, consider
adding it to `astrogators-shared-ui` and publishing a new version instead.

## Gotchas

- **React 19 strict types** — some third-party components with loose
  `@types/react@18` typings may throw TS errors under React 19. Check the dep
  has published a React-19-compatible type update before adopting.
- **`lucide-react` 1.x rename surface** — icon names are mostly stable, but
  some rarely-used icons were renamed between 0.x and 1.x. If an import
  fails, check the lucide changelog for the new name.
- **`astrogators-shared-ui` peer range is `^18 || ^19`** — safe to bump hub
  to React 19 without touching shared-ui. If you change React major again,
  update the peer range in shared-ui first and publish a new version.
