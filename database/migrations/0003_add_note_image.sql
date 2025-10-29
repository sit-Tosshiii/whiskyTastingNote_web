-- Ensure tasting_notes supports single image attachment
alter table if exists tasting_notes
  add column if not exists image_path text;

