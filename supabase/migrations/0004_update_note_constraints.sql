do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tasting_notes'
      and column_name = 'finish'
  ) then
    alter table public.tasting_notes rename column finish to summary;
  end if;
end;
$$;

alter table if exists public.tasting_notes
  add constraint if not exists tasting_notes_whisky_name_length check (char_length(whisky_name) <= 100),
  add constraint if not exists tasting_notes_distillery_name_length check (char_length(distillery_name) <= 100),
  add constraint if not exists tasting_notes_region_length check (char_length(region) <= 100),
  add constraint if not exists tasting_notes_cask_length check (char_length(cask) <= 100),
  add constraint if not exists tasting_notes_aroma_length check (char_length(aroma) <= 100),
  add constraint if not exists tasting_notes_flavor_length check (char_length(flavor) <= 100),
  add constraint if not exists tasting_notes_summary_length check (char_length(summary) <= 200),
  drop column if exists finish;
