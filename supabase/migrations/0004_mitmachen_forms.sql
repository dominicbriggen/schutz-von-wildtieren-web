-- Structured feedback & participation forms for the /mitmachen area.
--
--   WILDSEEK deployment reports        -> wildseek_reports
--   Wildlife-friendly fence feedback   -> fence_reports (report_group = 'project')
--   Comparison data on other fences    -> fence_reports (report_group = 'comparison')
--   Project interest / waiting list    -> project_interests
--
-- Trust model (identical to contact_messages): anonymous visitors may INSERT
-- their own submission, but only the admin (profiles.is_admin) can read,
-- manage, export or delete. Uploaded images live in a PRIVATE storage bucket
-- and are never publicly readable; the admin views them via short-lived
-- signed URLs generated with their authenticated (RLS-checked) session — no
-- service-role key is used at runtime.

-- ── Enums ─────────────────────────────────────────────────────────────
create type fence_report_group as enum ('project', 'comparison');

create type submission_status as enum ('neu', 'gesichtet', 'erledigt', 'archiviert');

create type interest_status as enum (
  'neu', 'kontaktiert', 'warteliste', 'zugesagt', 'abgeschlossen', 'abgelehnt'
);

-- ── WILDSEEK deployment reports ───────────────────────────────────────
create table wildseek_reports (
  id uuid primary key default gen_random_uuid(),
  -- Contact
  organization text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  canton text not null,
  municipality text not null,
  system_number text,
  -- Deployment
  report_from date,
  report_to date,
  deployment_count int,
  mounting_type text,
  mounting_type_other text,
  -- Rescued animals: [{ "species": text, "count": int }]
  no_rescue boolean not null default false,
  rescued_animals jsonb not null default '[]'::jsonb,
  -- Experience
  notes text,
  -- Images: [{ "path": text, "name": text, "size": int, "type": text }]
  images jsonb not null default '[]'::jsonb,
  image_publish_consent boolean not null default false,
  -- Admin workflow
  status submission_status not null default 'neu',
  admin_note text,
  created_at timestamptz not null default now()
);

-- ── Fence reports (project system + comparison systems, shared shape) ──
-- One table for both forms so the data is directly comparable. report_group
-- distinguishes our project fences from other existing systems. Project-only
-- and comparison-only columns are nullable and simply unused by the other
-- group.
create table fence_reports (
  id uuid primary key default gen_random_uuid(),
  report_group fence_report_group not null,
  -- Contact
  organization text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  canton text not null,
  municipality text not null,
  -- Fence system (shared core)
  fence_height_cm int,
  fence_length_m int,
  livestock_types text,
  livestock_count int,
  -- Project-only
  installation_date date,
  system_label text,
  -- Comparison-only
  fence_type text,
  fence_type_other text,
  fence_color text,
  fence_color_other text,
  fence_age text,
  -- Observation window (shared core, key for later comparisons)
  observation_from date,
  observation_to date,
  operating_days int,
  -- Entanglements of wild animals: [{ "species", "count", "outcome" }]
  entanglement_occurred boolean not null default false,
  entanglement_event_count int,
  entanglement_events jsonb not null default '[]'::jsonb,
  -- Wolf attacks within the protected area
  wolf_attack_occurred boolean not null default false,
  wolf_attack_event_count int,
  wolf_injured_livestock int,
  wolf_killed_livestock int,
  wolf_note text,
  -- Maintenance (project form only): 'ja' | 'teilweise' | 'nein'
  maintenance text,
  maintenance_note text,
  -- Images + consent
  images jsonb not null default '[]'::jsonb,
  image_publish_consent boolean not null default false,
  -- Admin workflow
  status submission_status not null default 'neu',
  admin_note text,
  created_at timestamptz not null default now()
);

-- ── Project interest / waiting list ───────────────────────────────────
create table project_interests (
  id uuid primary key default gen_random_uuid(),
  -- 'wildseek' | 'weidezaun' | 'beide'
  project_interest text not null,
  -- Contact
  organization text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  address text,
  postal_code text,
  city text,
  canton text not null,
  -- Needs
  wildseek_need text,
  wildseek_area text,
  fence_length_m int,
  livestock_types text,
  fence_situation text,
  notes text,
  -- Admin workflow
  status interest_status not null default 'neu',
  admin_note text,
  created_at timestamptz not null default now()
);

-- ── Indexes for admin filters ─────────────────────────────────────────
create index idx_wildseek_reports_created on wildseek_reports (created_at desc);
create index idx_wildseek_reports_canton on wildseek_reports (canton);
create index idx_fence_reports_created on fence_reports (created_at desc);
create index idx_fence_reports_group on fence_reports (report_group);
create index idx_fence_reports_canton on fence_reports (canton);
create index idx_project_interests_created on project_interests (created_at desc);
create index idx_project_interests_status on project_interests (status);

-- ── Row Level Security ─────────────────────────────────────────────────
alter table wildseek_reports enable row level security;
alter table fence_reports enable row level security;
alter table project_interests enable row level security;

-- Public may submit (INSERT only). There is deliberately NO public SELECT
-- policy: submitted form data is private and only the admin can read it.
create policy "wildseek_insert_public" on wildseek_reports
  for insert with check (true);
create policy "wildseek_select_admin" on wildseek_reports
  for select using (is_admin());
create policy "wildseek_update_admin" on wildseek_reports
  for update using (is_admin());
create policy "wildseek_delete_admin" on wildseek_reports
  for delete using (is_admin());

create policy "fence_insert_public" on fence_reports
  for insert with check (true);
create policy "fence_select_admin" on fence_reports
  for select using (is_admin());
create policy "fence_update_admin" on fence_reports
  for update using (is_admin());
create policy "fence_delete_admin" on fence_reports
  for delete using (is_admin());

create policy "interests_insert_public" on project_interests
  for insert with check (true);
create policy "interests_select_admin" on project_interests
  for select using (is_admin());
create policy "interests_update_admin" on project_interests
  for update using (is_admin());
create policy "interests_delete_admin" on project_interests
  for delete using (is_admin());

-- ── Admin-managed WILDSEEK mounting types (central, editable list) ─────
-- Seeded EMPTY on purpose: mounting-type designations are domain terms that
-- must not be invented. The admin adds the real labels under /admin/wildseek;
-- the public form always additionally offers a free-text "Andere Montageart".
insert into content_blocks (key, data)
values ('wildseek_mounting_types', '{"options": []}'::jsonb)
on conflict (key) do nothing;

-- ── Private storage bucket for form uploads ────────────────────────────
-- public = false: objects are NOT reachable via a guessable URL and cannot be
-- listed anonymously. Supabase enforces the MIME allow-list and the 10 MB size
-- limit server-side on every upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'form-uploads', 'form-uploads', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Anonymous visitors may only INSERT (upload) into the two form folders and
-- can never read, list, overwrite or delete. The admin has full read/manage
-- access and generates short-lived signed URLs to view the images.
create policy "form_uploads_insert_public" on storage.objects
  for insert with check (
    bucket_id = 'form-uploads'
    and (storage.foldername(name))[1] in ('wildseek', 'fence')
  );
create policy "form_uploads_select_admin" on storage.objects
  for select using (bucket_id = 'form-uploads' and is_admin());
create policy "form_uploads_update_admin" on storage.objects
  for update using (bucket_id = 'form-uploads' and is_admin());
create policy "form_uploads_delete_admin" on storage.objects
  for delete using (bucket_id = 'form-uploads' and is_admin());
