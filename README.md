# astrogators-hub

Landing page and authentication UI for **The Astrogator's Table**, a SWGOH
tooling ecosystem. This submodule hosts the marketing home page,
cross-app navigation, and the full auth flow (login, register, password
reset, email verification, profile + ally-code management).

It owns no persistent state. All data lives in the
[`astrogators-table`](../astrogators-table) backend or browser storage,
both accessed exclusively through the
[`astrogators-shared-ui`](../astrogators-shared-ui) library.

## Stack

- Node **24** (pinned via `.nvmrc` and `engines`)
- React **19.2** + react-dom **19.2**
- TypeScript **6**
- Vite **8** (`@vitejs/plugin-react` 6)
- React Router **7** — declarative `<Routes>`/`<Route>` API
- `astrogators-shared-ui` **^0.6.0** — `AuthProvider`, API client, shared components
- `lucide-react` **1.x** — icons

## Single-origin architecture

The hub, `mod-ledger-ui`, and both backends are served from one origin in
both dev and prod, fronted by the workspace nginx reverse proxy:

- Dev: `http://localhost/`
- Prod: `https://astrotable.dynv6.net/`

Every `VITE_*_URL` points through that proxy. Direct-port URLs
(e.g. `http://localhost:8000/...`) are not supported — they would break
auth-state sharing (localStorage is per-origin) and force CORS.

## Setup

```bash
nvm use            # activate Node 24
npm install
cp .env.example .env
npm run dev        # http://localhost:5173 (proxied as / in dev)
```

## Configuration

`.env` lives at the submodule root and is gitignored. Vite **inlines these
values at build time** — changing them requires a rebuild. The Docker build
forwards them via `--build-arg` (see `docker/docker-compose.yml`).

| Variable | Purpose | Dev | Prod |
|---|---|---|---|
| `VITE_ASTROGATORS_TABLE_URL` | Backend (auth + game data), including its `SERVICE_PREFIX` | `http://localhost/astrogators-table` | `https://astrotable.dynv6.net/astrogators-table` |
| `VITE_MOD_LEDGER_UI_URL` | Cross-app navigation target | `http://localhost/mod-ledger` | `https://astrotable.dynv6.net/mod-ledger` |

When adding a new variable, update `.env.example` and the consumer together.

## Scripts

```bash
npm run dev          # Vite dev server, port 5173
npm run build        # tsc + vite build → dist/
npm run preview      # serve dist/ on port 4173
npm run type-check   # tsc --noEmit
```

## Routes

Public:

- `/` — landing page
- `/login`, `/register`
- `/forgot-password`, `/reset-password?token=...`
- `/verify-email?token=...`

Protected (redirects to `/login` when unauthenticated):

- `/profile` — account info + ally-code management

Unknown paths redirect to `/`.

## Project layout

```
src/
├── App.tsx              # <Routes> + ProtectedRoute wrapper
├── main.tsx             # entry, mounts AuthProvider
├── components/
│   ├── Layout.tsx
│   ├── VerificationBanner.tsx
│   └── AllyCodeMigrationBanner.tsx
└── pages/
    ├── HomePage.tsx
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── ForgotPasswordPage.tsx
    ├── ResetPasswordPage.tsx
    ├── VerifyEmailPage.tsx
    └── ProfilePage.tsx
```

## Auth + API access

All auth and API calls go through `astrogators-shared-ui`. The hub does
not implement a second API client, second auth context, or bespoke JWT
handling. If shared-ui is missing something, extend it there and cut a new
release.

```tsx
import { useAuth, TopBar, Button, Card, Input } from 'astrogators-shared-ui';
import 'astrogators-shared-ui/styles';
```

## Docker

```bash
docker compose -f docker/docker-compose.yml --env-file .env up -d --build
```

The container runs with `network_mode: host` and listens on
`localhost:4173`. The workspace nginx (at the workspace root, not in this
submodule) is the single front door — never join another compose project's
network.

## Related

- [astrogators-shared-ui](../astrogators-shared-ui) — shared component + auth library
- [astrogators-table](../astrogators-table) — auth + game-data backend
- [mod-ledger-ui](../mod-ledger-ui) — sibling frontend
- [mod-ledger](../mod-ledger) — mod evaluation backend
