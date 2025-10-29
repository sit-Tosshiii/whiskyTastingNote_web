-- Allow attaching a single image to each tasting note
alter table if exists public.tasting_notes
  add column if not exists image_path text;

