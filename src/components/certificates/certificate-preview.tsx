"use client";

import { Award } from "lucide-react";
import { useState } from "react";

type CertificatePreviewProps = {
  imageUrl: string | null;
  title: string;
  href?: string | null;
};

export function CertificatePreview({ imageUrl, title, href }: CertificatePreviewProps) {
  const [hasImageError, setHasImageError] = useState(false);

  if (!imageUrl || hasImageError) {
    return (
      <div className="flex size-full items-center justify-center bg-muted/60 text-muted-foreground">
        <Award className="size-8 opacity-40" aria-hidden="true" />
      </div>
    );
  }

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={`Certificado ${title}`}
      className="size-full object-contain"
      loading="lazy"
      decoding="async"
      onError={() => setHasImageError(true)}
    />
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir certificado ${title} (nova aba)`}
      className="block size-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {image}
    </a>
  ) : image;
}
