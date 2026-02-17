# businessone

Internal tooling workspace for the BusinessOne student club.

## Interview Scheduler App

- Frontend app: `web/` (Next.js + React + TypeScript + Tailwind)
- Backend foundation: Supabase (`supabase/` migrations and config)

## Local setup

1. Install dependencies:
   - `cd web`
   - `npm install`
2. Copy env values:
   - `cp .env.example .env.local`
   - Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run frontend:
   - `npm run dev`

## Current status

Phase 1 foundation is in place (app scaffold + Supabase schema bootstrap). Next phases will add auth, availability management, interview matching, and Google Calendar/Gmail automation.
