-- Newsletter subscribers for goldsimulations.com.
-- Kept deliberately separate from auth.users so that the same email can later
-- create a game account via the normal Supabase signup flow without colliding
-- with a passwordless "newsletter ghost" record.

create extension if not exists citext;

create table public.newsletter_subscribers (
  id                   uuid primary key default gen_random_uuid(),
  email                citext not null unique,
  confirmation_token   uuid not null default gen_random_uuid(),
  confirmed_at         timestamptz,
  source               text not null default 'goldsimulations.com',
  topics               text[] not null default array['goldsimulations_news'],
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index newsletter_subscribers_confirmation_token_idx
  on public.newsletter_subscribers (confirmation_token);

alter table public.newsletter_subscribers enable row level security;

-- No policies are defined: only the service-role key (used by the server-side
-- subscribe action and confirm endpoint) can read or write this table.
