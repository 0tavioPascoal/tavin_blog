create table if not exists public.rate_limits (
  scope text not null,
  identifier text not null,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 1 check (attempts > 0),
  primary key (scope, identifier)
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

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
  if p_scope not in ('admin-login', 'admin-upload')
    or p_identifier !~ '^[a-f0-9-]{36,64}$'
    or (p_scope = 'admin-login' and (p_max_attempts <> 5 or p_window_seconds <> 900))
    or (p_scope = 'admin-upload' and (p_max_attempts <> 20 or p_window_seconds <> 3600)) then
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
