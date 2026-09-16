create table if not exists public.newsletter_campaign_deliveries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.article_email_campaigns(id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'sent', 'failed')),
  provider_message_id text,
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_campaign_deliveries_campaign_subscriber_unique
    unique (campaign_id, subscriber_id),
  constraint newsletter_campaign_deliveries_email_normalized
    check (email = lower(btrim(email)))
);

create index if not exists newsletter_campaign_deliveries_campaign_status_idx
  on public.newsletter_campaign_deliveries (campaign_id, status);

alter table public.newsletter_campaign_deliveries enable row level security;

revoke all on public.newsletter_campaign_deliveries from anon, authenticated;
