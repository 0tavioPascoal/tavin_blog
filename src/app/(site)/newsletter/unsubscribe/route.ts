import { unsubscribeSubscriberById } from "@/features/newsletter/repositories/newsletter-subscriber-repository";
import { verifyNewsletterUnsubscribeToken } from "@/features/newsletter/services/newsletter-unsubscribe-token";

export const dynamic = "force-dynamic";

function confirmationPage(title: string, message: string, status: number): Response {
  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>${title} | Otávio Pascoal</title>
  </head>
  <body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#172033;font-family:Arial,sans-serif;padding:24px;box-sizing:border-box">
    <main style="width:min(100%,520px);border:1px solid #d8dee8;border-radius:16px;background:#fff;padding:32px;box-sizing:border-box;box-shadow:0 16px 40px rgba(15,23,42,.08)">
      <div style="display:inline-grid;place-items:center;width:40px;height:40px;border-radius:11px;background:#2563eb;color:#fff;font-weight:800">OP</div>
      <h1 style="margin:24px 0 8px;font-size:24px;line-height:1.25">${title}</h1>
      <p style="margin:0;color:#475569;line-height:1.65">${message}</p>
      <a href="/" style="display:inline-block;margin-top:24px;color:#2563eb;font-weight:700;text-decoration:none">Voltar para o site</a>
    </main>
  </body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return confirmationPage(
      "Link inválido",
      "Este link de cancelamento não é válido.",
      400,
    );
  }

  try {
    const subscriberId = verifyNewsletterUnsubscribeToken(token);
    if (!subscriberId) {
      return confirmationPage(
        "Link inválido ou expirado",
        "Solicite uma nova mensagem da newsletter para obter outro link.",
        400,
      );
    }

    const unsubscribed = await unsubscribeSubscriberById(subscriberId);
    if (!unsubscribed) {
      return confirmationPage(
        "Inscrição não encontrada",
        "Não encontramos uma inscrição ativa para este link.",
        404,
      );
    }

    return confirmationPage(
      "Inscrição cancelada",
      "Você não receberá os próximos artigos por email.",
      200,
    );
  } catch {
    console.error("[newsletter] unsubscribe failed");
    return confirmationPage(
      "Não foi possível cancelar agora",
      "Tente novamente em alguns instantes.",
      500,
    );
  }
}
