import { SUBJECTS } from "../constants/subjects";
import { LEVELS } from "../constants/levels";

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

export function getContentTypeLabel(
  type: "video" | "document"
) {
  return type === "video" ? "Vídeo" : "Documento";
}
