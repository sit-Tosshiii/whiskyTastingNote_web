create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  display_name text,
  created_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists tasting_notes (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
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
  created_at timestamp with time zone not null default timezone('utc', now())
);

create index if not exists idx_tasting_notes_user_id_created_at
  on tasting_notes (user_id, created_at desc);
