import { SUBJECTS } from "../constants/subjects";
import { LEVELS } from "../constants/levels";
import type { PostContentType } from "../types/post";

export function getSubjectLabel(id: string) {
  return SUBJECTS.find(s => s.id === id)?.label ?? id;
}

export function getSubjectLabels(ids?: string[], fallbackId?: string) {
  const values = ids && ids.length > 0 ? ids : fallbackId ? [fallbackId] : [];
  return values.map(getSubjectLabel).join(", ");
}

export function getLevelLabel(id: string) {
  return LEVELS.find(l => l.id === id)?.label ?? id;
}

export function getContentTypeLabel(type: PostContentType) {
  switch (type) {
    case "video":
      return "Video";
    case "document":
      return "Documento";
    case "image":
      return "Imagem";
    case "playlist":
      return "Playlist";
    default:
      return "Conteudo";
  }
}
