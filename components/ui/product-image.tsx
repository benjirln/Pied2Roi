"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/placeholder.svg";

// Une URL est exploitable si elle est distante (http) ou locale (/...).
// Les placeholders `data:image/gif` issus du scraping sont considérés invalides.
function isUsable(src?: string | null): src is string {
  return !!src && (src.startsWith("http") || src.startsWith("/"));
}

/**
 * Image produit robuste : retombe sur un placeholder si l'URL est invalide
 * (data:, vide) ou si le chargement échoue (lien mort, 400/404).
 */
export function ProductImage({
  src,
  alt,
  ...rest
}: { src?: string | null } & Omit<ImageProps, "src">) {
  const [failed, setFailed] = useState(false);
  const finalSrc = !isUsable(src) || failed ? PLACEHOLDER : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        // Certaines URLs distantes répondent par une image 1×1 (lien mort côté
        // CDN) sans déclencher onError : on retombe alors sur le placeholder.
        if (!failed && e.currentTarget.naturalWidth <= 1) {
          setFailed(true);
        }
      }}
      {...rest}
    />
  );
}
