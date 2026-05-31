export type HeroAd = {
  id: string;

  type: "platform" | "native" | "banner";

  // imagem obrigatória
  image: string;

  // conteúdo opcional (para anúncios nativos)
  title?: string;
  description?: string;
  badge?: string;

  // CTA
  ctaText?: string;
  ctaLink?: string;

  sponsor?: string; // nome da empresa
};
