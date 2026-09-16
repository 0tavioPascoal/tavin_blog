# Newsletter

## Envio

As mensagens são enviadas pelo `GmailSmtpProvider`, usando Nodemailer e SMTP com
Senha de App do Google. Gmail SMTP é adequado apenas ao baixo volume atual.

As credenciais SMTP são exclusivamente server-side. Nunca use a senha normal da
conta Google: habilite verificação em duas etapas e gere uma Senha de App.

## Fonte e idempotência

O Supabase é a fonte dos inscritos. Cada campanha cria uma linha por destinatário
em `newsletter_campaign_deliveries`, protegida por `unique (campaign_id,
subscriber_id)`. Retries processam somente deliveries `pending` ou `failed`;
deliveries `sent` não são reenviadas.

O envio SMTP é individual: cada mensagem possui um único `to`. Não são usados CC,
BCC, fila, worker ou cron.

## Unsubscribe

Cada delivery recebe uma URL de cancelamento com token HMAC e expiração. O secret
de assinatura é exclusivo (`NEWSLETTER_UNSUBSCRIBE_SECRET`) e não reutiliza
credenciais do Supabase ou SMTP.

## Limitações

Gmail SMTP não oferece tracking programático de bounce e complaint neste fluxo.
Esses estados continuam preservados quando já existem, mas não são atualizados
automaticamente.
