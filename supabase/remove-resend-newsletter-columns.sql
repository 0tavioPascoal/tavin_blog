alter table public.newsletter_subscribers
  drop column if exists resend_contact_id;

alter table public.article_email_campaigns
  drop column if exists provider_broadcast_id,
  drop column if exists provider;
