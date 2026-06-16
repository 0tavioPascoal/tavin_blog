insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read article images" on storage.objects;
create policy "Public can read article images"
on storage.objects for select
using (bucket_id = 'article-images');

drop policy if exists "Admins can insert article images" on storage.objects;
create policy "Admins can insert article images"
on storage.objects for insert
with check (
  bucket_id = 'article-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update article images" on storage.objects;
create policy "Admins can update article images"
on storage.objects for update
using (
  bucket_id = 'article-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'article-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete article images" on storage.objects;
create policy "Admins can delete article images"
on storage.objects for delete
using (
  bucket_id = 'article-images'
  and exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);
