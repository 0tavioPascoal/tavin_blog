alter table public.site_settings add column if not exists resume_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', true, 5242880, array['application/pdf'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read resumes" on storage.objects;
create policy "Public can read resumes" on storage.objects for select using (bucket_id = 'resumes');
drop policy if exists "Admins can insert resumes" on storage.objects;
create policy "Admins can insert resumes" on storage.objects for insert with check (bucket_id = 'resumes' and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
drop policy if exists "Admins can update resumes" on storage.objects;
create policy "Admins can update resumes" on storage.objects for update using (bucket_id = 'resumes' and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())) with check (bucket_id = 'resumes' and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
drop policy if exists "Admins can delete resumes" on storage.objects;
create policy "Admins can delete resumes" on storage.objects for delete using (bucket_id = 'resumes' and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));
