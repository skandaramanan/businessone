-- Add interviewer_teams (many-to-many: person can be in multiple teams)
-- Add team to scheduler_bookings (Interviewer B's team for the interview)

create table public.interviewer_teams (
  interviewer_id text not null references public.interviewers(id) on delete cascade,
  team public.team not null,
  primary key (interviewer_id, team)
);

create index interviewer_teams_team_idx on public.interviewer_teams (team);
create index interviewer_teams_interviewer_idx on public.interviewer_teams (interviewer_id);

alter table public.scheduler_bookings
  add column team public.team;

alter table public.interviewer_teams enable row level security;
create policy "interviewer_teams_select" on public.interviewer_teams for select to anon using (true);

-- Seed: Ava (Events, Marketing), Liam (Projects, Strategy), Noah (Projects, Sponsorships), Mia (Content Creation, HR)
-- Add 2 more placeholder PLs for Projects (6 total) - using temp IDs for demo
-- Add 4 more interviewers for Projects team (6 PLs total: Liam, Noah + 4 new)
insert into public.interviewers (id, full_name) values
  ('i-ella', 'Ella Kim'),
  ('i-marcus', 'Marcus Jones'),
  ('i-sophia', 'Sophia Wu'),
  ('i-james', 'James Taylor');

insert into public.interviewer_teams (interviewer_id, team) values
  ('i-ava', 'Events'),
  ('i-ava', 'Marketing'),
  ('i-liam', 'Projects'),
  ('i-liam', 'Strategy'),
  ('i-noah', 'Projects'),
  ('i-noah', 'Sponsorships'),
  ('i-mia', 'Content Creation'),
  ('i-mia', 'HR'),
  ('i-ella', 'Projects'),
  ('i-marcus', 'Projects'),
  ('i-sophia', 'Projects'),
  ('i-james', 'Projects');
