# NBNZIA — Frontend

Next.js 16 (App Router) frontend for the NBNZIA portfolio site.

This app now fetches its "Work" and "Services" content, and submits its
contact form, to a separate Express + MongoDB backend (see `../backend`).
There's also an admin dashboard at `/admin` for managing that content and
incoming contact leads.

See the top-level `README.md` (one directory up) for full setup
instructions, architecture, environment variables, and API docs — this
file just covers the frontend-only quick start.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if backend isn't on :5000
npm run dev
```

Requires the backend (`../backend`) running for the homepage's dynamic
sections and the contact form to work — see the top-level README.
