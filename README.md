# NBNZIA — Portfolio Site with CMS Backend & Lead Management

A full-stack rebuild of the NBNZIA portfolio/agency frontend: the original
site was a single static page with hardcoded project/service data and a
contact form that went nowhere. This adds a real Express + MongoDB backend,
turns the homepage into CMS-driven content, and adds an admin dashboard so
the site owner can manage projects, services, and incoming leads without
touching code.

## 1. What changed

- **Contact form now works.** Submissions are validated (client + server),
  persisted to MongoDB, rate-limited against spam, and optionally trigger
  an email notification. Previously it only set local React state.
- **"Work" and "Services" sections are database-backed**, not hardcoded
  arrays. The homepage fetches them from the API with proper loading
  skeletons, error states, and empty states.
- **New admin dashboard** (`/admin`) — JWT-cookie-authenticated — where the
  site owner can:
  - Create/edit/delete/hide portfolio projects
  - Create/edit/delete/hide services
  - Read, search, filter, and triage incoming contact leads (mark
    unread/read/replied/archived, delete)
- **No visual regressions**: the public-facing homepage looks identical to
  the original — the GSAP/Lenis animations, layout, and styling are
  untouched. Only the data source and the contact form's behavior changed.

## 2. Architecture

```
┌─────────────────────────┐        REST/JSON         ┌──────────────────────────┐
│   frontend (Next.js)    │ ───────────────────────▶ │   backend (Express)      │
│   React 19, Tailwind 4  │  fetch(), credentials:    │   Mongoose ODM           │
│   GSAP/Lenis animation  │  'include' (cookie auth)  │   JWT (httpOnly cookie)  │
└─────────────────────────┘ ◀─────────────────────── └──────────────┬───────────┘
                                                                      │
                                                                      ▼
                                                              ┌───────────────┐
                                                              │   MongoDB     │
                                                              │ (Atlas/local) │
                                                              └───────────────┘
```

Two separate apps in one repo:

- **`/frontend`** — the original Next.js 16 App Router codebase, with the
  homepage sections wired to the API and a new `/admin` section added.
- **`/backend`** — a standalone Express + MongoDB/Mongoose REST API. Kept
  separate from the frontend (rather than Next.js API routes) per project
  requirements, and because it makes the API trivially reusable by any
  future client (mobile app, another frontend, etc.).

## 3. Tech stack & why

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19 | Already the existing codebase — kept to minimize churn and risk. |
| Backend | Node.js + Express | Minimal, well-understood, easy to reason about for a small API surface. |
| Database | MongoDB + Mongoose | Requested stack. Document model fits the content here well (projects/services are independent documents with no relational joins needed). |
| Auth | Custom JWT in an httpOnly cookie | Only one admin account exists — a full auth provider (NextAuth, Auth0) would be unnecessary weight. A cookie (not localStorage) avoids exposing the token to XSS. |
| Validation | Zod (backend), manual + server-message surfacing (frontend) | Type-safe schemas, clear error messages returned to the client. |
| Email | Nodemailer (optional, SMTP) | Contact form works fully without it — email is a "nice to have" notification layer, not a hard dependency, so a misconfigured SMTP setting can't break lead capture. |
| Rate limiting | express-rate-limit | Basic spam protection on the one public write endpoint. |

## 4. Project structure

```
backend/
  src/
    config/db.js          Mongo connection
    models/                Admin, Project, Service, ContactSubmission
    middleware/            auth guard, error handler, rate limiter
    validators/schemas.js  Zod schemas + validation middleware
    controllers/           business logic per resource
    routes/                Express routers per resource
    app.js                 Express app (middleware, route mounting)
    server.js              entrypoint (connects DB, starts server)
    seed.js                creates admin user + seeds Project/Service data
  .env.example
  package.json

frontend/
  app/
    page.tsx               homepage (unchanged)
    admin/
      page.tsx              redirects to /admin/login or /admin/dashboard
      login/page.tsx         admin login form
      dashboard/page.tsx     tabbed dashboard (Leads / Projects / Services)
  components/
    Work.tsx, Services.tsx, Footer.tsx   updated to use the API
    admin/                  AdminShell, ProjectsManager, ServicesManager, LeadsInbox
  lib/
    api.ts                 typed fetch client (cookie auth, error handling)
    types.ts                shared TypeScript types
    useAdminAuth.ts         admin session hook
  .env.local.example
```

## 5. Local setup

### Prerequisites
- Node.js 18+
- A MongoDB instance — either local (`mongod` running on default port) or
  a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed     # creates the admin account + seeds projects/services
npm run dev      # starts the API on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# edit .env.local if your backend isn't on localhost:5000
npm run dev      # starts the site on http://localhost:3000
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to sign in with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `backend/.env` before seeding.

### Production notes
- Same `MONGODB_URI` variable works for a hosted Atlas connection string —
  no code changes needed between local and production.
- Set `NODE_ENV=production` so cookies are issued with `Secure` and
  `SameSite=None` (required for cross-domain cookie auth if the frontend
  and backend are deployed to different domains).
- Set `CLIENT_URL` to the deployed frontend origin(s) (comma-separated if
  more than one) so CORS allows it.

## 6. Environment variables

**Backend (`backend/.env`)**

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Signing secret for admin session tokens |
| `JWT_EXPIRES_IN` | Session lifetime (default `7d`) |
| `COOKIE_NAME` | Name of the auth cookie |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by `npm run seed` to create the first admin |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `CONTACT_NOTIFY_EMAIL` | Optional — enables email notifications for new leads |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Contact form rate limiting |

**Frontend (`frontend/.env.local`)**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

No secrets are committed — both `.env` files are gitignored, and
`.env.example` / `.env.local.example` document the required names only.

## 7. API overview

All responses are JSON: `{ success: true, data }` or
`{ success: false, message, errors? }`.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Admin login, sets httpOnly cookie |
| POST | `/api/auth/logout` | — | Clears the cookie |
| GET | `/api/auth/me` | admin | Current session info |
| GET | `/api/projects` | — | Published projects (public homepage) |
| POST/PUT/DELETE | `/api/projects[/:id]` | admin | Manage projects |
| GET | `/api/services` | — | Published services (public homepage) |
| POST/PUT/DELETE | `/api/services[/:id]` | admin | Manage services |
| POST | `/api/contact` | — (rate-limited) | Submit the contact form |
| GET | `/api/contact` | admin | List/search/filter leads (`?status=&search=&page=&limit=`) |
| PATCH | `/api/contact/:id` | admin | Update a lead's status |
| DELETE | `/api/contact/:id` | admin | Delete a lead |

## 8. Demo credentials

Set your own in `backend/.env` before running `npm run seed`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`). No credentials are hardcoded or
committed anywhere in the repo.

## 9. Key technical decisions & trade-offs

- **Separate Express backend instead of Next.js API routes**: chosen per
  the assignment's stack guidance and to keep the API deployable/testable
  independently of the frontend. Trade-off: two servers to run locally
  instead of one, and CORS/cookie configuration to get right across
  origins.
- **Single hardcoded admin account (seeded), not a full user system**:
  the product only needs one owner-operator, not multi-user accounts. A
  `Role`/multi-admin system would be straightforward to add on top of the
  existing `Admin` model if needed later.
- **Inline styles retained in components** rather than converting the
  whole site to CSS modules/Tailwind classes for the public pages: this
  minimizes the risk of visually breaking the original animated design
  while focusing the time budget on backend integration. The new
  `/admin` UI uses inline styles for consistency with the codebase's
  existing approach, kept intentionally simpler/utilitarian since it's an
  internal tool, not the marketing surface.
- **Email delivery is best-effort and non-blocking**: a contact
  submission is always saved even if SMTP is unconfigured or fails, so a
  misconfigured mail server can never cause lead data loss.

## 10. Known limitations / what I'd improve with more time

- No image upload — project/service images are entered as URLs (CDN
  links). Adding file upload (e.g. to S3/Cloudinary) would let the admin
  upload images directly instead of hosting them elsewhere first.
- No pagination UI on the Projects/Services admin lists (fine at current
  scale; the Leads inbox already supports search/filter server-side).
- No automated tests yet (unit tests for controllers/validators and a
  couple of integration tests for the contact flow would be the next
  addition).
- No drag-and-drop reordering for projects/services — `order` is a plain
  number field editable per item.
- Admin password reset flow doesn't exist — only credential rotation via
  re-running the seed script or direct DB update.

## 11. AI tools used

Built with Claude (Anthropic) as a pair-programmer/agent: it read and
inventoried the existing frontend codebase, proposed the feature scope
and architecture, and wrote the backend and frontend integration code
described above. Every file was reviewed for correctness and consistency
with the rest of the codebase; the resulting API design, data models, and
trade-off decisions were made deliberately for this specific product
rather than generated generically.
