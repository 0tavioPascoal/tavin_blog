create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  issuer text not null,
  description text not null,
  credential_url text,
  image_url text,
  issued_at date not null,
  expires_at date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificates_public_sort_idx
on public.certificates (status, sort_order, issued_at desc);

alter table public.certificates enable row level security;

drop policy if exists "Public can read published certificates" on public.certificates;
create policy "Public can read published certificates"
on public.certificates for select
using (status = 'published');

drop policy if exists "Admins can read all certificates" on public.certificates;
create policy "Admins can read all certificates"
on public.certificates for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write certificates" on public.certificates;
create policy "Admins can write certificates"
on public.certificates for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
