create schema if not exists extensions;
create extension if not exists unaccent with schema extensions;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles
  add column if not exists category_id uuid references public.categories(id) on delete set null;

create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_id, tag_id)
);

create index if not exists categories_active_sort_idx on public.categories (is_active, sort_order, name);
create index if not exists tags_active_name_idx on public.tags (is_active, name);
create index if not exists article_tags_tag_id_idx on public.article_tags (tag_id);

insert into public.tags (name, slug)
select distinct tag_value, lower(regexp_replace(extensions.unaccent(tag_value), '[^a-zA-Z0-9]+', '-', 'g'))
from public.articles
cross join lateral unnest(tags) as tag_value
where tag_value is not null
  and btrim(tag_value) <> ''
on conflict (slug) do nothing;

insert into public.article_tags (article_id, tag_id)
select distinct articles.id, tags.id
from public.articles
cross join lateral unnest(articles.tags) as tag_value
join public.tags on tags.slug = lower(regexp_replace(extensions.unaccent(tag_value), '[^a-zA-Z0-9]+', '-', 'g'))
where tag_value is not null
  and btrim(tag_value) <> ''
on conflict do nothing;

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.article_tags enable row level security;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories for select
using (is_active = true);

drop policy if exists "Admins can read all categories" on public.categories;
create policy "Admins can read all categories"
on public.categories for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write categories" on public.categories;
create policy "Admins can write categories"
on public.categories for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Public can read active tags" on public.tags;
create policy "Public can read active tags"
on public.tags for select
using (is_active = true);

drop policy if exists "Admins can read all tags" on public.tags;
create policy "Admins can read all tags"
on public.tags for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write tags" on public.tags;
create policy "Admins can write tags"
on public.tags for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Public can read article tags for published articles" on public.article_tags;
create policy "Public can read article tags for published articles"
on public.article_tags for select
using (
  exists (
    select 1
    from public.articles
    where articles.id = article_tags.article_id
      and articles.status = 'published'
  )
);

drop policy if exists "Admins can read all article tags" on public.article_tags;
create policy "Admins can read all article tags"
on public.article_tags for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write article tags" on public.article_tags;
create policy "Admins can write article tags"
on public.article_tags for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
