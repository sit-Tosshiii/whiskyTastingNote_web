-- Align tasting_notes schema with latest application requirements
alter table if exists tasting_notes
  add column if not exists summary text,
  add constraint if not exists tasting_notes_whisky_name_length check (char_length(whisky_name) <= 100),
  add constraint if not exists tasting_notes_distillery_name_length check (char_length(distillery_name) <= 100),
  add constraint if not exists tasting_notes_region_length check (char_length(region) <= 100),
  add constraint if not exists tasting_notes_cask_length check (char_length(cask) <= 100),
  add constraint if not exists tasting_notes_aroma_length check (char_length(aroma) <= 100),
  add constraint if not exists tasting_notes_flavor_length check (char_length(flavor) <= 100),
  add constraint if not exists tasting_notes_summary_length check (char_length(summary) <= 200);

update tasting_notes set summary = finish where summary is null and finish is not null;

alter table if exists tasting_notes drop column if exists finish;
