-- Enable RLS on all tables for defense in depth.
-- With RLS on, no row is accessible unless a policy allows it.

-- ========== Scheduler tables (used by unauthenticated app) ==========

alter table public.interviewers enable row level security;
alter table public.interviewer_slots enable row level security;
alter table public.scheduler_bookings enable row level security;

-- interviewers: read-only for anon (seed data, no client mutations)
create policy "interviewers_select"
  on public.interviewers for select
  to anon
  using (true);

-- interviewer_slots: anon can read, insert, delete (availability feature)
create policy "interviewer_slots_select"
  on public.interviewer_slots for select
  to anon
  using (true);
create policy "interviewer_slots_insert"
  on public.interviewer_slots for insert
  to anon
  with check (true);
create policy "interviewer_slots_delete"
  on public.interviewer_slots for delete
  to anon
  using (true);

-- scheduler_bookings: anon can read and create (booking feature)
create policy "scheduler_bookings_select"
  on public.scheduler_bookings for select
  to anon
  using (true);
create policy "scheduler_bookings_insert"
  on public.scheduler_bookings for insert
  to anon
  with check (true);

-- ========== Auth-based tables (0001, empty until auth is used) ==========
-- Enable RLS with no anon policies = no public access. Service role bypasses.

alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.availability_windows enable row level security;
alter table public.candidate_availability_windows enable row level security;
alter table public.interviews enable row level security;
alter table public.interview_participants enable row level security;
alter table public.audit_logs enable row level security;

-- When auth is added, create policies like:
--   profiles: select using (auth.uid() = id)
--   availability_windows: select/insert/update/delete using (auth.uid() = profile_id)
-- etc.
