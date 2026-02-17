-- Interviewers (replaces hardcoded defaultInterviewers)
create table public.interviewers (
  id text primary key,
  full_name text not null
);

-- Interviewer availability slots (replaces availabilityByInterviewer in localStorage)
create table public.interviewer_slots (
  id uuid primary key default gen_random_uuid(),
  interviewer_id text not null references public.interviewers(id) on delete cascade,
  slot_key text not null,
  created_at timestamptz not null default now(),
  unique (interviewer_id, slot_key)
);

-- Scheduler bookings (replaces bookings in localStorage)
create table public.scheduler_bookings (
  id uuid primary key default gen_random_uuid(),
  candidate_name text not null,
  candidate_email text not null,
  interviewer_a_id text not null references public.interviewers(id),
  interviewer_b_id text not null references public.interviewers(id),
  slot_key text not null,
  created_at timestamptz not null default now(),
  check (interviewer_a_id != interviewer_b_id)
);

create index interviewer_slots_interviewer_idx on public.interviewer_slots (interviewer_id);
create index scheduler_bookings_slot_idx on public.scheduler_bookings (interviewer_a_id, interviewer_b_id, slot_key);

-- Seed the 4 interviewers
insert into public.interviewers (id, full_name) values
  ('i-ava', 'Ava Shah'),
  ('i-liam', 'Liam Chen'),
  ('i-noah', 'Noah Patel'),
  ('i-mia', 'Mia Lopez');
