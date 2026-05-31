import { SUBJECTS } from "../constants/subjects";
import { LEVELS } from "../constants/levels";

export function getSubjectLabel(id: string) {
  return SUBJECTS.find(s => s.id === id)?.label ?? id;
}

export function getLevelLabel(id: string) {
  return LEVELS.find(l => l.id === id)?.label ?? id;
}

export function getContentTypeLabel(
  type: "video" | "document"
) {
  return type === "video" ? "Vídeo" : "Documento";
}
