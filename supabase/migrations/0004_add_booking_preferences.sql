-- Add team enum and preference columns to scheduler_bookings
create type public.team as enum (
  'Projects',
  'Events',
  'Sponsorships',
  'Marketing',
  'Content Creation',
  'HR',
  'Strategy'
);
-- Note: 'Content Creation' is a valid unquoted enum value in PostgreSQL

alter table public.scheduler_bookings
  add column first_preference public.team,
  add column second_preference public.team;
