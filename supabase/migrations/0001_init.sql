-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Profiles table synced with Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists preferences jsonb default '{}'::jsonb;

alter table public.profiles enable row level security;

create policy if not exists "Users can view their profile"
  on public.profiles as permissive
  for select
  using (auth.uid() = id);

create policy if not exists "Users can modify their profile"
  on public.profiles as permissive
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Tasting notes table for individual users
create table if not exists public.tasting_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  whisky_name text not null check (char_length(whisky_name) <= 100),
  distillery_name text check (char_length(distillery_name) <= 100),
  region text check (char_length(region) <= 100),
  abv numeric(5,2) check (abv between 0 and 100),
  cask text check (char_length(cask) <= 100),
  aroma text check (char_length(aroma) <= 100),
  flavor text check (char_length(flavor) <= 100),
  summary text check (char_length(summary) <= 200),
  image_path text,
  rating smallint check (rating between 0 and 100),
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create index if not exists idx_tasting_notes_user_id_created_at
  on public.tasting_notes (user_id, created_at desc);

alter table public.tasting_notes enable row level security;

create policy if not exists "Users view own notes"
  on public.tasting_notes as permissive
  for select
  using (auth.uid() = user_id);

create policy if not exists "Users manage own notes"
  on public.tasting_notes as permissive
  for insert, update, delete
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp_profiles
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger set_timestamp_tasting_notes
  before update on public.tasting_notes
  for each row
  execute function public.set_updated_at();
