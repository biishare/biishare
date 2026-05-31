// constants/labelMaps.ts
import { SUBJECTS } from "./subjects";
import { LEVELS } from "./levels";

export const SUBJECT_LABEL_MAP: Record<string, string> =
  Object.fromEntries(SUBJECTS.map(s => [s.id, s.label]));

export const LEVEL_LABEL_MAP: Record<string, string> =
  Object.fromEntries(LEVELS.map(l => [l.id, l.label]));
