import type { Leccion } from "../types/api.types";

export interface ActivityDraft {
  signature: string;
  answers: Record<string, any>;
  scrollTop: number;
}

export function activityDraftKey(userId: string, planId: string, day: number) {
  return `ien:activity-draft:v2:${userId}:${planId}:${day}`;
}

export function lessonSignature(lesson: Leccion) {
  return JSON.stringify([lesson.titulo, lesson.campos_respuesta, lesson.datos_leccion]);
}

export function readActivityDraft(key: string, signature: string): ActivityDraft | null {
  try {
    const draft = JSON.parse(localStorage.getItem(key) || "null");
    if (!draft || draft.signature !== signature || !draft.answers ||
      typeof draft.answers !== "object" || Array.isArray(draft.answers) ||
      !Number.isFinite(draft.scrollTop) || draft.scrollTop < 0) return null;
    return draft;
  } catch {
    return null;
  }
}

export function saveActivityDraft(key: string, draft: ActivityDraft): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function removeActivityDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // El guardado definitivo en el servidor no depende del almacenamiento local.
  }
}
