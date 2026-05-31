import { Ad } from "../types/ad"

export function resolveAdConfig(ad: Ad, isMobile: boolean) {
  return {
    fitMode: isMobile
      ? "contain"
      : (ad.fitMode ?? "cover"),

    blur: isMobile ? 10 : (ad.blurStrength ?? 18),

    showForeground: true,
  };
}