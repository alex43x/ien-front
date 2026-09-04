import type { GrupoDocument } from "../types/api.types";

export function obtenerGrupoId(valor: string | GrupoDocument | undefined | null): string | null {
  if (!valor) return null;
  return typeof valor === "string" ? valor : valor._id;
}

export function obtenerNombreGrupo(valor: string | GrupoDocument | undefined | null): string | null {
  if (!valor || typeof valor === "string") return null;
  return valor.nombre;
}