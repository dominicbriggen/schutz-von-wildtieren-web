-- RoomUp-Style content schema for "Schutz von Wildtieren"
-- Simple, extensible content model: singleton content blocks + collections
-- (projects, news, success entries, gallery images) + a media library.
-- Public (anon) reads only published content; a single admin profile
-- (profiles.is_admin) can read/write everything. All writes are enforced
-- server-side via Row Level Security, never trusted from the client alone.

create extension if not exists "pgcrypto";

create type content_status as enum ('draft', 'published', 'hidden');

-- One row per authenticated user. Created automatically on signup.
-- is_admin must be flipped manually (via SQL) after the owner creates
-- their account, so a stray signup can never grant itself access.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create function is_admin()
returns boolean as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$ language sql security definer stable set search_path = public;

create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Flexible singleton sections (Startseite-Hero, Verein-Text, Kontakt,
-- Spenden-Text, Footer, ...). One JSON blob per key, edited as a whole
-- via the admin dashboard's dedicated forms.
create table content_blocks (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger trg_content_blocks_updated
  before update on content_blocks
  for each row execute function set_updated_at();

-- Image library backing the "Bilder hochladen" admin feature.
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  alt_text text,
  credit text,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  status content_status not null default 'draft',
  cover_image_url text,
  images jsonb not null default '[]'::jsonb,
  results text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create trigger trg_projects_updated
  before update on projects
  for each row execute function set_updated_at();

create table news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  status content_status not null default 'draft',
  cover_image_url text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create trigger trg_news_updated
  before update on news
  for each row execute function set_updated_at();

-- Timeline-style success/results entries, optionally tied to a project.
create table success_entries (
  id uuid primary key default gen_random_uuid(),
  project_slug text,
  title text not null,
  period_label text,
  value_label text,
  order_index int not null default 0,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_success_updated
  before update on success_entries
  for each row execute function set_updated_at();

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  category text,
  year text,
  order_index int not null default 0,
  status content_status not null default 'published',
  created_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------

alter table profiles enable row level security;
alter table content_blocks enable row level security;
alter table media enable row level security;
alter table projects enable row level security;
alter table news enable row level security;
alter table success_entries enable row level security;
alter table gallery_images enable row level security;

create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());

create policy "content_blocks_select_all" on content_blocks
  for select using (true);
create policy "content_blocks_insert_admin" on content_blocks
  for insert with check (is_admin());
create policy "content_blocks_update_admin" on content_blocks
  for update using (is_admin());
create policy "content_blocks_delete_admin" on content_blocks
  for delete using (is_admin());

create policy "media_select_all" on media
  for select using (true);
create policy "media_insert_admin" on media
  for insert with check (is_admin());
create policy "media_update_admin" on media
  for update using (is_admin());
create policy "media_delete_admin" on media
  for delete using (is_admin());

create policy "projects_select_public_or_admin" on projects
  for select using (status = 'published' or is_admin());
create policy "projects_insert_admin" on projects
  for insert with check (is_admin());
create policy "projects_update_admin" on projects
  for update using (is_admin());
create policy "projects_delete_admin" on projects
  for delete using (is_admin());

create policy "news_select_public_or_admin" on news
  for select using (status = 'published' or is_admin());
create policy "news_insert_admin" on news
  for insert with check (is_admin());
create policy "news_update_admin" on news
  for update using (is_admin());
create policy "news_delete_admin" on news
  for delete using (is_admin());

create policy "success_select_public_or_admin" on success_entries
  for select using (status = 'published' or is_admin());
create policy "success_insert_admin" on success_entries
  for insert with check (is_admin());
create policy "success_update_admin" on success_entries
  for update using (is_admin());
create policy "success_delete_admin" on success_entries
  for delete using (is_admin());

create policy "gallery_select_public_or_admin" on gallery_images
  for select using (status = 'published' or is_admin());
create policy "gallery_insert_admin" on gallery_images
  for insert with check (is_admin());
create policy "gallery_update_admin" on gallery_images
  for update using (is_admin());
create policy "gallery_delete_admin" on gallery_images
  for delete using (is_admin());

-- Storage: public "media" bucket, admin-only writes ------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media_bucket_public_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_bucket_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and is_admin());
create policy "media_bucket_admin_update" on storage.objects
  for update using (bucket_id = 'media' and is_admin());
create policy "media_bucket_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and is_admin());
