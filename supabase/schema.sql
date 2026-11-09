-- Run this whole file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 150),
  attendance boolean not null,
  guest_count integer not null default 0 check (guest_count between 0 and 8),
  food_preference text check (food_preference is null or char_length(food_preference) <= 200),
  accommodation boolean not null default false,
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 1 and 150),
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

alter table public.guests enable row level security;
alter table public.guestbook enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Public can submit RSVP" on public.guests;
create policy "Public can submit RSVP" on public.guests
for insert to anon, authenticated
with check (
  char_length(guest_name) between 1 and 150
  and guest_count between 0 and 8
  and (attendance = true or guest_count = 0)
);

drop policy if exists "Public can submit wishes" on public.guestbook;
create policy "Public can submit wishes" on public.guestbook
for insert to anon, authenticated
with check (
  char_length(guest_name) between 1 and 150
  and char_length(message) between 1 and 1000
);

drop policy if exists "Admins can read guests" on public.guests;
create policy "Admins can read guests" on public.guests
for select to authenticated
using (exists (
  select 1 from public.admins
  where admins.user_id = (select auth.uid()) and admins.role = 'admin'
));

drop policy if exists "Admins can read guestbook" on public.guestbook;
create policy "Admins can read guestbook" on public.guestbook
for select to authenticated
using (exists (
  select 1 from public.admins
  where admins.user_id = (select auth.uid()) and admins.role = 'admin'
));

drop policy if exists "Admins can read own admin row" on public.admins;
create policy "Admins can read own admin row" on public.admins
for select to authenticated
using (user_id = (select auth.uid()));

grant insert on public.guests to anon, authenticated;
grant insert on public.guestbook to anon, authenticated;
grant select on public.guests to authenticated;
grant select on public.guestbook to authenticated;
grant select on public.admins to authenticated;

-- After creating the admin user in Supabase Authentication, run:
-- insert into public.admins (user_id, role)
-- values ('PASTE_AUTH_USER_UUID_HERE', 'admin');
--
-- Enable Realtime for guests and guestbook in Database > Replication
-- (or add both tables to supabase_realtime publication).


-- Guestbook messages are intentionally public so guests can read the wishes section.
drop policy if exists "Public can read guestbook wishes" on public.guestbook;
create policy "Public can read guestbook wishes" on public.guestbook
for select to anon, authenticated using (true);
grant select on public.guestbook to anon;

-- Recommendations managed from the password-protected wedding admin dashboard.
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('attraction', 'accommodation')),
  name text not null check (char_length(name) between 1 and 150),
  description text not null check (char_length(description) between 1 and 1500),
  location_url text not null,
  images text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recommendations_max_four_images check (cardinality(images) <= 4)
);

alter table public.recommendations enable row level security;
drop policy if exists "Public can view recommendations" on public.recommendations;
create policy "Public can view recommendations" on public.recommendations
for select to anon, authenticated using (true);
grant select on public.recommendations to anon, authenticated;

-- Public image bucket. Writes are performed only by the server using the service role key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-recommendations', 'wedding-recommendations', true, 5242880,
        array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

-- Section-specific website background images. Admin uploads through the server only.
create table if not exists public.wedding_backgrounds (
  section text primary key check (section in ('hero','countdown','details','timeline','venue','rsvp','guestbook','gift','recommendations','footer')),
  image_path text,
  image_url text,
  overlay numeric not null default 0.25 check (overlay between 0 and 0.8),
  updated_at timestamptz not null default now()
);
alter table public.wedding_backgrounds enable row level security;
drop policy if exists "Public can view wedding backgrounds" on public.wedding_backgrounds;
create policy "Public can view wedding backgrounds" on public.wedding_backgrounds for select to anon, authenticated using (true);
grant select on public.wedding_backgrounds to anon, authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-backgrounds', 'wedding-backgrounds', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg','image/png','image/webp'];


-- Flexible photo gallery blocks that can be inserted between any homepage sections.
create table if not exists public.wedding_gallery_blocks (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  placement text not null default 'after-hero',
  orientation text not null default 'landscape' check (orientation in ('portrait','landscape','square')),
  columns_count integer not null default 3 check (columns_count between 1 and 6),
  images jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.wedding_gallery_blocks enable row level security;
drop policy if exists "Public can view wedding gallery" on public.wedding_gallery_blocks;
create policy "Public can view wedding gallery" on public.wedding_gallery_blocks for select to anon, authenticated using (true);
grant select on public.wedding_gallery_blocks to anon, authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wedding-gallery','wedding-gallery',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=10485760, allowed_mime_types=array['image/jpeg','image/png','image/webp'];
