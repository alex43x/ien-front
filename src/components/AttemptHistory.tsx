import { useEffect, useState } from 'react';
import { attemptsService, type AttemptDetail, type AttemptSummary } from '../services/attempts.service';
import { errorMessage } from '../utils/errors';
import ErrorNotice from './ui/ErrorNotice';
import TestInicialResultados from './TestInicialResultados';
import ActividadesDiariasLista from './ActividadesDiariasLista';
import type { DiaPlan } from '../types/api.types';

const labels: Record<string, string> = { activo: 'Activo', pendiente: 'Pendiente', reiniciado: 'Reiniciado', abandonado: 'Abandonado', completado: 'Completado', inactividad: 'Inactividad', finalizacion: 'Finalización', racha_rota: 'Racha interrumpida' };
const label = (value: string) => labels[value] ?? value.replace(/_/g, ' ');
const date = (value?: string | null) => value ? new Date(value).toLocaleString() : '—';

/** Las respuestas históricas pueden ser texto, listas, tablas u objetos antiguos. */
function Detail({ detail }: { detail: AttemptDetail }) {
  const historicalDays: DiaPlan[] = (detail.progreso_diario ?? [])
    .filter(day => day.completado)
    .map(day => ({
      dia_numero: day.dia_numero,
      completado: true,
      fecha_completado: day.fecha_completado ?? null,
      respuesta_usuario: Array.isArray(day.respuesta_usuario) ? day.respuesta_usuario as DiaPlan['respuesta_usuario'] : null,
      cabecera: null,
      conclusion: null,
      contenido_especial: null,
      leccion: day.contenido_snapshot ?? null,
    }));
  return <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
      <div><p className="text-xs text-muted-foreground">Estado</p>{label(detail.estado)}</div>
      <div><p className="text-xs text-muted-foreground">Inicio</p>{date(detail.fecha_inicio)}</div>
      <div><p className="text-xs text-muted-foreground">Cierre</p>{date(detail.fecha_cierre)}</div>
      <div><p className="text-xs text-muted-foreground">Mejor racha</p>{detail.racha_maxima} días</div>
    </div>
    {detail.motivo_cierre && <p className="text-sm text-muted-foreground">Motivo del cierre: {label(detail.motivo_cierre)}</p>}
    {detail.test_inicial_origen_id && <p className="text-xs text-muted-foreground">Test inicial conservado del intento de origen.</p>}
    {detail.test_inicial && <TestInicialResultados data={{ ...detail.test_inicial, respuestas: (detail.test_inicial.respuestas ?? []).map(answer => ({ ...answer, texto: answer.texto || `Pregunta ${answer.pregunta_numero}`, competencia_label: answer.competencia_label || detail.test_inicial?.puntuaciones_por_competencia?.find(p => p.competencia === answer.competencia)?.competencia_label || label(answer.competencia || '') })) }} />}
    <div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Actividades completadas</p><h3 className="font-['Lora'] text-lg font-semibold">Días de este intento</h3></div>
    <ActividadesDiariasLista dias={historicalDays} />
    {!!detail.eventos?.length && <details className="rounded-xl border border-border p-4"><summary className="cursor-pointer text-sm font-medium">Eventos del intento</summary><ul className="mt-3 space-y-3 text-xs text-muted-foreground">{detail.eventos.map((event, i) => <li key={i}>{date(event.fecha)} · {label(event.tipo)}{event.motivo && ` · ${label(event.motivo)}`}{event.envio && ` · Envío: ${label(event.envio)}`}</li>)}</ul></details>}
  </div>;
}

function historyError(err: any) {
  return err.response?.status === 403 ? 'No tienes acceso a este historial.' : err.response?.status === 404 ? 'Este registro ya no está disponible.' : errorMessage(err);
}

// El padre usa key={userId}: un cambio de paciente descarta toda la selección.
export default function AttemptHistory({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const [list, setList] = useState<AttemptSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [retry, setRetry] = useState(0);
  const [detailRetry, setDetailRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setList([]); setSelected(null); setDetail(null);
    attemptsService.list(userId, page).then(data => {
      if (active) { setList(data.intentos); setTotal(data.total); }
    }).catch(err => { if (active) setError(historyError(err)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, page, retry]);
  useEffect(() => {
    let active = true;
    setDetail(null); setDetailError(''); setDetailLoading(!!selected);
    if (selected) attemptsService.detail(userId, selected).then(data => { if (active) setDetail(data); })
      .catch(err => { if (active) setDetailError(historyError(err)); }).finally(() => { if (active) setDetailLoading(false); });
    return () => { active = false; };
  }, [userId, selected, detailRetry, page]);
  return <section className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
    <div><p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Historial</p><h2 className="font-['Lora'] text-lg font-semibold text-foreground">Intentos del programa</h2></div>
    {loading ? <p role="status" className="text-sm text-muted-foreground">Cargando intentos…</p> : error ? <ErrorNotice message={error} onRetry={() => setRetry(n => n + 1)} /> : <>
      {!list.length && <p className="text-sm text-muted-foreground">Todavía no hay intentos registrados.</p>}
      <div className="space-y-2">{list.map(item => <button key={item._id} onClick={() => setSelected(item._id)} aria-pressed={selected === item._id} className={`w-full text-left rounded-xl border p-3 text-sm transition-colors ${selected === item._id ? 'border-accent bg-accent/10' : 'border-border hover:bg-secondary'}`}>
        <span className="font-semibold">{item.numero_intento ? `Intento ${item.numero_intento}` : 'Intento anterior'}</span><span className="text-muted-foreground"> · {label(item.estado)} · Día {Math.min(item.dia_actual, 30)}</span><span className="block text-xs text-muted-foreground mt-1">{date(item.fecha_inicio)}</span>
      </button>)}</div>
      {total > 20 && <div className="flex items-center justify-between gap-3 text-xs"><button disabled={page === 1} onClick={() => { setSelected(null); setDetail(null); setPage(p => p - 1); }} className="rounded-xl border border-border px-3 py-2 disabled:opacity-40">Anterior</button><span>Página {page} de {Math.ceil(total / 20)}</span><button disabled={page * 20 >= total} onClick={() => { setSelected(null); setDetail(null); setPage(p => p + 1); }} className="rounded-xl border border-border px-3 py-2 disabled:opacity-40">Siguiente</button></div>}
    </>}
    {selected && <div className="border-t border-border pt-5">{detailLoading ? <p role="status" className="text-sm text-muted-foreground">Cargando intento…</p> : detailError ? <ErrorNotice message={detailError} onRetry={() => setDetailRetry(n => n + 1)} /> : detail && <Detail key={detail._id} detail={detail} />}</div>}
  </section>;
}
