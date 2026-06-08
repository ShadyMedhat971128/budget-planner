# Budget Planner — Full Lifecycle Plan

## 1. Vision & Outcomes

Build a cross-platform budget planner with local-first mobile sync that teaches the full software lifecycle: development → CI/CD → production → monitoring. AI-powered financial insights are built into the roadmap from day one.

### Core Capabilities

- Track income & expenses across web and mobile
- Set and monitor budgeting goals
- Offline-first mobile experience (edit without internet, sync when online)
- AI-generated spending reports and suggestions
- Sync conflict resolution (seamless for 95%+, user-flagged for conflicts)
- Real-time notifications for signups and user feedback

---

## 2. Tech Stack Decisions

### Chosen Stack

| Layer | Technology | Why |
|---|---|---|
| **Web** | Next.js App Router | Learn SSR, RSCs, file-based routing. Resume value. |
| **Mobile** | Expo + Expo Router | Know React/Expo already. File-based routing. Code sharing with web. |
| **Backend** | FastAPI (Python) | Know it already. AI/ML native. One language for all business logic. |
| **Auth** | Supabase Auth (self-hosted, Podman) | Zero lock-in. OAuth, MFA out-of-the-box. Mobile SDK. RLS at DB level. |
| **Database** | PostgreSQL | Universal. Never migrate off. Self-host dev, managed later. |
| **Sync Engine** | RxDB | Built-in replication. Works web + mobile same API. Conflict strategies built-in. |
| **Containerization** | Podman + Podman Compose | Already studying it. OCI-compatible. Docker alternative. |
| **Tunnel** | Cloudflare Tunnel (cloudflared) | Expose local API without open ports. |
| **CI/CD** | GitHub Actions | Free for public repos. Tight GitHub integration. |
| **Notifications** | Discord webhook → Resend → custom monitoring app | Growth path: simple → weekly summary → full dashboard. |
| **Monitoring** | Sentry (errors) + OpenTelemetry + Grafana (metrics) | Industry standard observability stack. |

### Key Decisions We Discussed

**Why not WatermelonDB?** RxDB chosen over WatermelonDB because:
- Same API works on web (IndexedDB) and mobile (SQLite)
- Built-in conflict resolution strategies (LWW, per-field, custom)
- Replication protocol is already defined — just implement on FastAPI
- Web can also work offline

**Why not Clerk/Auth.js?** Supabase Auth self-hosted gives zero lock-in, OAuth + MFA out-of-the-box, and a mobile SDK. Auth.js has no mobile SDK.

**Why not Fastify/Node?** AI features (LLM inference, spending reports) are trivially integrated in Python. A Node backend would require a separate Python microservice for AI work.

**Why not Supabase-only?** No custom server logic for sync, notifications, webhooks, or AI. Business logic in RLS is hard to test and debug.

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│              Web (Next.js App Router)                  │
│  Auth: Supabase Auth Web SDK                           │
│  State: React Query + Zustand                          │
│  Offline: RxDB (IndexedDB adapter)                     │
│  UI: Tailwind + shadcn/ui                              │
└──────────────────────┬───────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼───────────────────────────────┐
│              Backend (FastAPI)                         │
│  Auth: Supabase JWT verification middleware            │
│  API: Budget CRUD, Sync endpoints, AI endpoints        │
│  Sync: RxDB replication protocol (pull/push)           │
│  AI: LLM-powered reports, categorization, predictions  │
│  Events: Signup hooks, feedback processor              │
│  Queue: ARQ (Redis) for background tasks               │
│  Notifications: Discord → Resend → Monitor API         │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│       PostgreSQL + Supabase Auth (self-hosted)        │
│  Supabase: Auth (GoTrue), real-time, RLS              │
│  Migrations: Alembic                                   │
│  Container: Podman Compose                              │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           Mobile (Expo + Expo Router)                  │
│  Auth: Supabase Auth Mobile SDK                        │
│  Local DB: RxDB (SQLite adapter)                       │
│  Sync: RxDB replication with FastAPI                   │
│  Conflict UI: "Sync Issues" screen with resolution     │
│  UI: NativeWind (Tailwind for RN)                      │
└──────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Discord    │    │    Resend    │    │   Monitor    │
│   Webhook    │ →  │ (weekly sum) │ →  │   App (fut)  │
│  (signups)   │    │ (feedback)   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 4. Phased Roadmap (Dev → Prod → Monitor)

### Phase 0 — Scaffolding (Week 1)

- Initialize monorepo with `backend/`, `web/`, `mobile/`, `shared/`, `infra/`
- Git + conventional commits + pre-commit hooks (ruff, mypy, ESLint, Prettier)
- Podman Compose for Postgres + Supabase Auth + Redis
- FastAPI skeleton with health check endpoint
- Next.js skeleton with Tailwind + shadcn/ui
- Expo skeleton with Expo Router + NativeWind
- Cloudflare Tunnel setup (cloudflared)
- `.env` structure with pydantic-settings

### Phase 1 — Auth & Data Layer (Week 2)

- Supabase Auth self-hosted: signup, login, logout, session management
- FastAPI JWT middleware (verify Supabase tokens)
- SQLAlchemy models + Alembic migrations (users, transactions, budgets, categories)
- Shared Pydantic schemas
- Basic CRUD endpoints for transactions and budgets
- RLS policies on Postgres tables
- Auth integration on web + mobile

### Phase 2 — Core UI & API (Week 3-4)

**Web (Next.js)**
- Dashboard layout with server components + client interactive islands
- Transaction list with React Query
- Budget form (create/edit)
- Category management
- Responsive design (Tailwind)

**Mobile (Expo)**
- Dashboard screen (Expo Router)
- Transaction list with swipe actions
- Budget form
- Category picker

**API (FastAPI)**
- Full CRUD for all entities
- Pagination, filtering, sorting
- Input validation with Pydantic
- Error handling middleware

### Phase 3 — Local-First Sync (Week 5-6)

- RxDB setup on mobile (SQLite adapter)
- RxDB setup on web (IndexedDB adapter)
- RxDB replication protocol on FastAPI (pull/push endpoints)
- Offline detection + queue
- Sync status indicator (pending, syncing, synced, error)
- Conflict detection on server (LWW + per-field merge)
- Conflict UI on mobile/web ("Sync Issues" screen)
- Write test suite for sync scenarios

### Phase 4 — AI Features (Week 7-8)

- Spending report generator (rule-based prototype, then LLM-powered)
- Auto-categorization of transactions
- Monthly narrative report endpoint
- Budget suggestions ("You might overspend in dining this month")
- Background task queue (ARQ + Redis) for report generation
- AI endpoint with rate limiting + caching

### Phase 5 — CI/CD (Week 8-9)

- GitHub Actions: lint → test → build → push container image (ghcr.io)
- GitHub Actions: Alembic migrations as CI step
- GitHub Actions: deploy trigger (ssh to your machine or cloud)
- Pre-commit hooks enforced in CI
- Container image tagging (git commit sha + latest)
- Automated test run on PR

### Phase 6 — Production Hardening (Week 9-10)

- Rate limiting (slowapi)
- CORS configuration
- Security headers (Caddy middleware)
- Database backup strategy (pg_dump cron)
- Graceful shutdown handling
- Health check + readiness probes
- Caddy reverse proxy with auto HTTPS
- Cloudflare Tunnel for API

### Phase 7 — Monitoring & Observability (Week 10-11)

- Sentry SDK (backend + frontend + mobile)
- Structured logging with structlog (Python)
- OpenTelemetry auto-instrumentation
- Prometheus metrics endpoint + Grafana dashboard
- Discord webhook for signup events
- User feedback endpoint → Discord → email queue
- Uptime monitoring (Grafana Cloud or UptimeRobot)
- Alerting on error rate spike

### Phase 8 — Polish & Scale (Ongoing)

- Performance optimization (query profiling, N+1 fixes)
- Push notifications (Firebase Cloud Messaging)
- Email weekly report (Resend)
- PWA support for web
- E2E tests (Playwright)
- Rate limit per-user analytics
- Feature flags
- Monitoring app (separate micro-app, future)

---

## 5. Data Model (Core tables)

```
users
  id, email, name, avatar_url, created_at, updated_at

transactions
  id (UUID, client-generated), user_id, category_id
  amount, type (income/expense), description, date
  created_at, updated_at, deleted_at (soft delete)
  sync_status (server/local/conflicted)

categories
  id, user_id, name, icon, color, budget_id (nullable)
  created_at, updated_at, deleted_at

budgets
  id, user_id, category_id, target_amount, period (monthly/weekly)
  start_date, end_date, created_at, updated_at

sync_metadata
  id, user_id, table_name, record_id, last_synced_at, server_version

conflicts
  id, user_id, table_name, record_id, local_data (JSON)
  server_data (JSON), resolved (bool), resolved_at, resolution (local/server/merge)

feedback
  id, user_id, message, category (bug/feature/other)
  created_at, resolved_at

reports
  id, user_id, type (monthly/ai), content (JSON/text)
  generated_at, period_start, period_end
```

---

## 6. Sync Protocol (RxDB Replication)

### Pull Endpoint

```
GET /api/sync/{collection}?lastPulledAt={timestamp}&limit={n}
```

Response:
```json
{
  "documents": [
    { "id": "uuid", "amount": 50, "updated_at": 1717000050, "_deleted": false }
  ],
  "lastPulledAt": 1717000123
}
```

### Push Endpoint

```
POST /api/sync/{collection}
```

Body:
```json
{
  "documents": [
    { "id": "uuid", "amount": 75, "updated_at": 1717000100, "_deleted": false }
  ],
  "lastPulledAt": 1717000050
}
```

Response: `200 OK` with `{ "conflicts": [...] }` or `204 No Content`.

### Conflict Resolution

1. If `incoming.updated_at > server.updated_at` → incoming wins (write-through)
2. If `incoming.updated_at <= server.updated_at` → server wins (no-op)
3. If both timestamps within 5s window → per-field comparison:
   - Same field changed → return conflict
   - Different fields changed → merge both
4. Conflict records stored in `conflicts` table
5. Client fetches conflicts on next pull
6. User resolves in "Sync Issues" UI

---

## 7. File Structure

```
budget-planner/
├── backend/
│   ├── app/
│   │   ├── api/           # route handlers
│   │   ├── core/          # config (pydantic-settings), security, db session
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic v2 schemas
│   │   ├── services/      # business logic (reports, AI, sync)
│   │   └── utils/         # helpers (pagination, error handling)
│   ├── alembic/           # migrations
│   ├── tests/
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── requirements.in
├── web/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # shared components
│   ├── lib/               # React Query hooks, API client
│   └── package.json
├── mobile/
│   ├── app/               # Expo Router pages
│   ├── components/
│   ├── lib/               # RxDB config, sync, hooks
│   └── package.json
├── shared/
│   ├── types/             # Shared TypeScript types (hand-written or code-gen)
│   └── api-client/        # Axios/fetch wrapper
├── infra/
│   ├── compose.yaml       # Podman Compose (FastAPI, Postgres, Redis, Supabase Auth)
│   ├── Caddyfile
│   ├── scripts/           # backup, deploy, migrate
│   └── monitoring/        # Grafana dashboards, Prometheus config
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── PLAN.md
├── WBS.csv
└── README.md
```

---

## 8. Learning Outcomes per Phase

| Phase | What you'll learn |
|---|---|
| 0 | Monorepo tooling, pre-commit, containerized dev environment |
| 1 | Auth flows (JWT, OAuth, sessions), ORM, migrations, RLS |
| 2 | Next.js App Router, Expo Router, React Query, Tailwind |
| 3 | Offline-first architecture, replication protocols, conflict resolution |
| 4 | LLM integration, prompt engineering, async task queues, caching |
| 5 | CI/CD pipelines, container registries, automated quality gates |
| 6 | Reverse proxy, HTTPS, rate limiting, backup strategies, security hardening |
| 7 | Observability (logs, metrics, traces), alerting, error tracking |
| 8 | Performance optimization, push notifications, E2E testing, feature flags |

---

## 9. Monitoring Growth Path

```
Phase 7 (current):
  Discord ── signup events, feedback submissions, error alerts

Phase 8 (soon):
  Add Sentry ── error tracking with stack traces
  Add Resend ── weekly email summary to you

Phase 9 (future):
  Separate monitoring app (Next.js or Svelte):
    - User signup timeline chart
    - Error rate per version
    - Server health (CPU, RAM, response p50/p95/p99)
    - Feedback dashboard
    - Can monitor multiple apps you build later
```
