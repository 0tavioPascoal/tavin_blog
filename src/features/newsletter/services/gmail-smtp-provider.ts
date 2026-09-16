import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import type {
  NewsletterEmailMessage,
  NewsletterEmailProvider,
  NewsletterSendResult,
} from "@/features/newsletter/types/newsletter";
import { getGmailSmtpConfig } from "@/lib/env";

function getSmtpErrorCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  return typeof error.code === "string" ? error.code : null;
}

function translateSmtpError(error: unknown): Error {
  const code = getSmtpErrorCode(error);
  if (code === "EAUTH") {
    return new Error("O provider de email recusou a autenticação configurada.");
  }
  if (code === "ECONNECTION" || code === "ETIMEDOUT" || code === "ESOCKET") {
    return new Error("Não foi possível conectar ao provider de email.");
  }
  return new Error("Não foi possível enviar a mensagem pelo provider de email.");
}

export class GmailSmtpProvider implements NewsletterEmailProvider {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor() {
    const config = getGmailSmtpConfig();
    if (!config) {
      throw new Error("A configuração SMTP da newsletter está incompleta.");
    }

    this.from = config.SMTP_FROM;
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_APP_PASSWORD,
      },
    });
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {
      throw translateSmtpError(error);
    }
  }

  async send(message: NewsletterEmailMessage): Promise<NewsletterSendResult> {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      return { providerMessageId: info.messageId || null };
    } catch (error) {
      throw translateSmtpError(error);
    }
  }
}
