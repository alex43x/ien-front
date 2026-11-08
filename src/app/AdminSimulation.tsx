import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { attemptsService, type SimulationState, type SimulationAction } from '../services/attempts.service';
import { useSubmission } from '../hooks/useSubmission';
import { errorMessage } from '../utils/errors';
import ErrorNotice from '../components/ui/ErrorNotice';
import Lectura from './Lectura';

const dayButton = 'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors disabled:opacity-40';

export default function AdminSimulation() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);
  const { pending, submit } = useSubmission();
  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setState(null);
    attemptsService.simulation().then(data => { if (active) setState(data); })
      .catch(err => { if (active) setError(errorMessage(err)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  useEffect(() => {
    const main = pageRef.current?.closest('main');
    if (main) main.scrollTop = 0;
  }, [state?.version]);

  const move = (action: SimulationAction) => submit(async () => {
    if (!state) return;
    setError(''); setNotice('');
    try { setState(await attemptsService.moveSimulation(action, state.version)); }
    catch (err: any) {
      if (err.response?.status === 409) {
        setNotice('La simulación cambió en otra pestaña. Se actualizó la vista; puedes continuar desde el día actual.');
        setState(null); setRetry(n => n + 1);
      } else setError(errorMessage(err));
    }
  });
  return (
    <div ref={pageRef} className="mx-auto max-w-3xl space-y-5 px-4 py-5 sm:px-6 sm:py-7">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Simular programa</h1>
          <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">Modo simulación</span>
        </div>
        <p className="text-sm text-muted-foreground">Explora las actividades a tu ritmo. Las respuestas de prueba no se guardan ni modifican el progreso de los pacientes.</p>
      </header>

      {state && (
        <nav aria-label="Días de la simulación" aria-busy={pending} className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold tabular-nums text-foreground">Día {state.dia_actual} de 30</p>
              <button type="button" disabled={pending} onClick={() => move('reiniciar')} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40">
                <RotateCcw size={13} aria-hidden="true" /> Volver al día 1
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={pending || state.dia_actual <= 1} onClick={() => move('retroceder')} className={`${dayButton} border border-border text-foreground hover:bg-secondary`}>
                <ChevronLeft size={15} aria-hidden="true" /> Retroceder
              </button>
              <button type="button" disabled={pending || state.dia_actual >= 30} onClick={() => move('avanzar')} className={`${dayButton} bg-foreground text-background hover:opacity-90`}>
                Avanzar <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${state.dia_actual / 30 * 100}%` }} />
          </div>
        </nav>
      )}
      {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
      {error && <ErrorNotice message={error} onRetry={() => setRetry(n => n + 1)} />}
      {loading ? <p role="status" className="text-sm text-muted-foreground">Cargando simulación…</p> : state?.leccion ? (
        <Lectura key={state.version} simulation={{ leccion: state.leccion, onComplete: () => move('avanzar'), disabled: pending || state.dia_actual >= 30 }} />
      ) : state && <p className="text-sm text-muted-foreground">No hay contenido para este día. Puedes explorar los demás días con los controles.</p>}
    </div>
  );
}
