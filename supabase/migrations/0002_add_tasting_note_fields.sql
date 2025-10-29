-- Add missing columns for tasting note metadata
alter table if exists public.tasting_notes
  add column if not exists distillery_name text,
  add column if not exists region text,
  add column if not exists abv numeric(5,2) check (abv between 0 and 100),
  add column if not exists cask text;

