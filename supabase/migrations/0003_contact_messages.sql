-- Contact form submissions. Anyone can insert (that's the point of a
-- public contact form); only the admin can read, mark as read, or delete.
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "contact_messages_insert_public" on contact_messages
  for insert with check (true);
create policy "contact_messages_select_admin" on contact_messages
  for select using (is_admin());
create policy "contact_messages_update_admin" on contact_messages
  for update using (is_admin());
create policy "contact_messages_delete_admin" on contact_messages
  for delete using (is_admin());
