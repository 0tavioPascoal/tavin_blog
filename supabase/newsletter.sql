create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'subscribed'
    check (status in ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  source text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_normalized check (email = lower(btrim(email))),
  constraint newsletter_subscribers_email_unique unique (email)
);

create table if not exists public.article_email_campaigns (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.articles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'sent', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  last_error text,
  constraint article_email_campaigns_post_unique unique (post_id)
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status, subscribed_at desc);
create index if not exists article_email_campaigns_status_idx
  on public.article_email_campaigns (status, created_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.article_email_campaigns enable row level security;

revoke all on public.newsletter_subscribers from anon, authenticated;
revoke all on public.article_email_campaigns from anon, authenticated;

drop policy if exists "Admins can manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins can manage newsletter subscribers"
on public.newsletter_subscribers for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

drop policy if exists "Admins can manage article email campaigns" on public.article_email_campaigns;
create policy "Admins can manage article email campaigns"
on public.article_email_campaigns for all
using (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where admin_users.user_id = auth.uid()));

create or replace function public.check_rate_limit(
  p_scope text,
  p_identifier text,
  p_max_attempts integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_attempts integer;
begin
  if p_identifier !~ '^[a-f0-9-]{36,64}$'
    or not (
      (p_scope = 'admin-login' and p_max_attempts = 5 and p_window_seconds = 900)
      or (p_scope = 'admin-upload' and p_max_attempts = 20 and p_window_seconds = 3600)
      or (p_scope = 'newsletter-subscribe' and p_max_attempts = 5 and p_window_seconds = 900)
    ) then
    return false;
  end if;

  insert into public.rate_limits as limits (scope, identifier, window_started_at, attempts)
  values (p_scope, p_identifier, now(), 1)
  on conflict (scope, identifier) do update
  set
    window_started_at = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then now()
      else limits.window_started_at
    end,
    attempts = case
      when limits.window_started_at <= now() - make_interval(secs => p_window_seconds) then 1
      else limits.attempts + 1
    end
  returning attempts into current_attempts;

  delete from public.rate_limits
  where window_started_at < now() - interval '2 days';

  return current_attempts <= p_max_attempts;
end;
$$;

revoke all on function public.check_rate_limit(text, text, integer, integer) from public;
grant execute on function public.check_rate_limit(text, text, integer, integer) to anon, authenticated;
