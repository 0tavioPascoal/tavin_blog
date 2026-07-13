alter table public.certificates
add column if not exists pdf_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificate-files', 'certificate-files', true, 5242880, array['application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read certificate files" on storage.objects;
create policy "Public can read certificate files"
on storage.objects for select using (bucket_id = 'certificate-files');

drop policy if exists "Admins can insert certificate files" on storage.objects;
create policy "Admins can insert certificate files"
on storage.objects for insert with check (
  bucket_id = 'certificate-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);

drop policy if exists "Admins can update certificate files" on storage.objects;
create policy "Admins can update certificate files"
on storage.objects for update
using (
  bucket_id = 'certificate-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
)
with check (
  bucket_id = 'certificate-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);

drop policy if exists "Admins can delete certificate files" on storage.objects;
create policy "Admins can delete certificate files"
on storage.objects for delete using (
  bucket_id = 'certificate-files'
  and exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);
