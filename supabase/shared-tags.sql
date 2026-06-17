create schema if not exists extensions;
create extension if not exists unaccent with schema extensions;

create table if not exists public.project_tags (
  project_id uuid not null references public.projects(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, tag_id)
);

create table if not exists public.certificate_tags (
  certificate_id uuid not null references public.certificates(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (certificate_id, tag_id)
);

create index if not exists project_tags_tag_id_idx on public.project_tags (tag_id);
create index if not exists certificate_tags_tag_id_idx on public.certificate_tags (tag_id);

insert into public.tags (name, slug)
select distinct tag_value, lower(regexp_replace(extensions.unaccent(tag_value), '[^a-zA-Z0-9]+', '-', 'g'))
from public.projects
cross join lateral unnest(tags) as tag_value
where tag_value is not null
  and btrim(tag_value) <> ''
on conflict (slug) do nothing;

insert into public.project_tags (project_id, tag_id)
select distinct projects.id, tags.id
from public.projects
cross join lateral unnest(projects.tags) as tag_value
join public.tags on tags.slug = lower(regexp_replace(extensions.unaccent(tag_value), '[^a-zA-Z0-9]+', '-', 'g'))
where tag_value is not null
  and btrim(tag_value) <> ''
on conflict do nothing;

alter table public.project_tags enable row level security;
alter table public.certificate_tags enable row level security;

drop policy if exists "Public can read project tags for published projects" on public.project_tags;
create policy "Public can read project tags for published projects"
on public.project_tags for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tags.project_id
      and projects.status = 'published'
  )
);

drop policy if exists "Admins can read all project tags" on public.project_tags;
create policy "Admins can read all project tags"
on public.project_tags for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write project tags" on public.project_tags;
create policy "Admins can write project tags"
on public.project_tags for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Public can read certificate tags for published certificates" on public.certificate_tags;
create policy "Public can read certificate tags for published certificates"
on public.certificate_tags for select
using (
  exists (
    select 1
    from public.certificates
    where certificates.id = certificate_tags.certificate_id
      and certificates.status = 'published'
  )
);

drop policy if exists "Admins can read all certificate tags" on public.certificate_tags;
create policy "Admins can read all certificate tags"
on public.certificate_tags for select
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can write certificate tags" on public.certificate_tags;
create policy "Admins can write certificate tags"
on public.certificate_tags for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
