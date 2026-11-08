import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, expect, test, vi } from 'vitest';
import Lectura from '../app/Lectura';
import BloqueCierre from '../app/BloqueCierre';
import { planService } from '../services/plan.service';
import { activityDraftKey, lessonSignature } from '../services/activityDraft';
import { ThemeProvider } from '../context/ThemeContext';
import type { TodayPlanResponse } from '../types/api.types';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'patient' } }) }));
vi.mock('../services/plan.service', () => ({ planService: { getTodayPlan: vi.fn(), completeDay: vi.fn() } }));
const today: TodayPlanResponse = {
  plan_id: 'old-plan', dia_actual: 5, cabecera: null, conclusion: null, contenido_especial: null,
  leccion: { dia_actual: 5, titulo: 'Lectura de prueba', tipo: 'lectura', emociones_objetivo: [], respuesta_tipo: 'texto', campos_respuesta: [{ id: 'answer', tipo: 'texto', etiqueta: 'Mi respuesta' }], datos_leccion: { ejercicio: { nombre: 'Ejercicio', instruccion: 'Responde' } } },
};
const key = activityDraftKey('patient', 'old-plan', 5);
function mount(entry: string | { pathname: string; state: unknown } = '/lectura') {
  return render(<ThemeProvider><MemoryRouter initialEntries={[entry]}><Routes>
    <Route path="/lectura" element={<Lectura />} /><Route path="/bloque-cierre" element={<BloqueCierre />} />
    <Route path="/dashboard" element={<p>Inicio actualizado</p>} />
  </Routes></MemoryRouter></ThemeProvider>);
}
beforeEach(() => { vi.clearAllMocks(); vi.mocked(planService.getTodayPlan).mockResolvedValue(today); });
async function answer() { const user = userEvent.setup(); await user.type(await screen.findByRole('textbox', { name: 'Mi respuesta' }), 'Mi texto'); return user; }

test('el envío conserva el intento y día abiertos y solo limpia su borrador tras confirmar', async () => {
  let finish!: (value: any) => void;
  vi.mocked(planService.completeDay).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  localStorage.setItem(activityDraftKey('patient', 'other-plan', 5), 'otro borrador');
  mount(); const user = await answer();
  await user.click(screen.getByRole('button', { name: 'Completar actividad' }));
  expect(planService.completeDay).toHaveBeenCalledWith({ plan_id: 'old-plan', dia_actual: 5 }, [{ id: 'answer', valor: 'Mi texto', tipo: 'texto' }]);
  expect(localStorage.getItem(key)).toContain('Mi texto');
  expect(screen.getByRole('button', { name: '' })).toBeDisabled();
  finish({}); await screen.findByText('Inicio actualizado');
  expect(localStorage.getItem(key)).toBeNull();
  expect(localStorage.getItem(activityDraftKey('patient', 'other-plan', 5))).toBe('otro borrador');
});

test('409 conserva el borrador y no lo traslada al nuevo intento al actualizar', async () => {
  vi.mocked(planService.completeDay).mockRejectedValue({ response: { status: 409 } });
  mount(); const user = await answer(); await user.click(screen.getByRole('button', { name: 'Completar actividad' }));
  expect(await screen.findByText(/La actividad cambió/)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Completar actividad' })).toBeDisabled();
  expect(localStorage.getItem(key)).toContain('Mi texto');
  vi.mocked(planService.getTodayPlan).mockResolvedValue({ ...today, plan_id: 'new-plan' });
  await user.click(screen.getByRole('button', { name: 'Actualizar actividad' }));
  await waitFor(() => expect(screen.getByRole('textbox', { name: 'Mi respuesta' })).toHaveValue(''));
  expect(planService.completeDay).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(key)).toContain('Mi texto');
});

test('un 413 muestra el mensaje del servidor y permite acortar la respuesta', async () => {
  vi.mocked(planService.completeDay).mockRejectedValue({ isAxiosError: true, response: { status: 413, data: { error: 'La respuesta es demasiado grande' } } });
  mount(); const user = await answer(); await user.click(screen.getByRole('button', { name: 'Completar actividad' }));
  expect(await screen.findByText('La respuesta es demasiado grande')).toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Mi respuesta' })).toHaveValue('Mi texto');
  expect(localStorage.getItem(key)).toContain('Mi texto');
});

test('cierre de bloque envía exactamente el contexto transportado desde la lectura', async () => {
  vi.mocked(planService.getTodayPlan).mockResolvedValue({ ...today, conclusion: 'Reflexión final de prueba' });
  vi.mocked(planService.completeDay).mockResolvedValue({} as any);
  mount(); const user = await answer(); await user.click(screen.getByRole('button', { name: 'Continuar a reflexión final' }));
  expect(planService.completeDay).not.toHaveBeenCalled();
  await user.click(await screen.findByRole('button', { name: 'Finalizar y volver al inicio' }));
  await screen.findByText('Inicio actualizado');
  expect(planService.completeDay).toHaveBeenCalledWith({ plan_id: 'old-plan', dia_actual: 5 }, [{ id: 'answer', valor: 'Mi texto', tipo: 'texto' }]);
  expect(localStorage.getItem(key)).toBeNull();
});

test('cierre antiguo sin contexto regresa a cargar la lectura sin enviar', async () => {
  mount({ pathname: '/bloque-cierre', state: { diaActual: 5, conclusion: 'Antigua' } });
  await screen.findByRole('textbox', { name: 'Mi respuesta' });
  expect(planService.completeDay).not.toHaveBeenCalled();
});

test('borradores v1 y de otro intento no contaminan una actividad nueva', async () => {
  const draft = JSON.stringify({ signature: lessonSignature(today.leccion!), answers: { answer: 'Respuesta anterior' }, scrollTop: 0 });
  localStorage.setItem('ien:activity-draft:v1:patient:5', draft);
  localStorage.setItem(activityDraftKey('patient', 'other-plan', 5), draft);
  mount(); expect(await screen.findByRole('textbox', { name: 'Mi respuesta' })).toHaveValue('');
});

test('conflicto en cierre conserva el borrador y bloquea repetir el envío', async () => {
  vi.mocked(planService.getTodayPlan).mockResolvedValue({ ...today, conclusion: 'Cierre' });
  vi.mocked(planService.completeDay).mockRejectedValue({ response: { status: 409 } });
  mount(); const user = await answer(); await user.click(screen.getByRole('button', { name: 'Continuar a reflexión final' }));
  await user.click(await screen.findByRole('button', { name: 'Finalizar y volver al inicio' }));
  expect(await screen.findByText(/La actividad cambió/)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Finalizar y volver al inicio' })).toBeDisabled();
  expect(localStorage.getItem(key)).toContain('Mi texto');
});
