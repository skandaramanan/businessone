create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'interviewer');
create type public.interview_status as enum (
  'scheduled',
  'completed',
  'cancelled',
  'rescheduled'
);
create type public.audit_action as enum (
  'availability_created',
  'availability_updated',
  'availability_deleted',
  'candidate_created',
  'candidate_updated',
  'interview_suggested',
  'interview_scheduled',
  'interview_rescheduled',
  'interview_cancelled',
  'calendar_event_created',
  'email_sent'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.user_role not null default 'interviewer',
  timezone text not null default 'America/New_York',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  notes text,
  timezone text not null default 'America/New_York',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.availability_windows (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.candidate_availability_windows (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/New_York',
  status public.interview_status not null default 'scheduled',
  google_calendar_event_id text,
  email_message_id text,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.interview_participants (
  interview_id uuid not null references public.interviews(id) on delete cascade,
  interviewer_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (interview_id, interviewer_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action public.audit_action not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index availability_windows_profile_idx
  on public.availability_windows (profile_id, starts_at, ends_at);

create index candidate_availability_candidate_idx
  on public.candidate_availability_windows (candidate_id, starts_at, ends_at);

create index interviews_candidate_idx
  on public.interviews (candidate_id, starts_at);

create index interviews_status_idx
  on public.interviews (status);

create index interview_participants_interviewer_idx
  on public.interview_participants (interviewer_id);

create index audit_logs_target_idx
  on public.audit_logs (target_type, target_id);
