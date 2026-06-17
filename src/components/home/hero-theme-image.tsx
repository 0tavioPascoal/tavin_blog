import Image from "next/image";

const heroLightImageSrc = "/images/hero-otavio-light.png";
const heroDarkImageSrc = "/images/hero-otavio-dark.png";

type HeroThemeImageProps = {
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function HeroThemeImage({
  alt,
  sizes,
  className,
  priority = false,
}: HeroThemeImageProps) {
  return (
    <>
      <Image
        src={heroLightImageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover object-center dark:hidden ${className ?? ""}`}
      />

      <Image
        src={heroDarkImageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`hidden object-cover object-center dark:block ${className ?? ""}`}
      />
    </>
  );
}