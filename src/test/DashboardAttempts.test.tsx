import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, expect, test, vi } from 'vitest';
import Dashboard from '../app/Dashboard';
import { planService } from '../services/plan.service';
import { ThemeProvider } from '../context/ThemeContext';
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'patient' } }) }));
vi.mock('../services/plan.service', () => ({ planService: { getProfile: vi.fn(), getTodayPlan: vi.fn(), activateAttempt: vi.fn(), continueAttempt: vi.fn(), getBienvenida: vi.fn(), getDays: vi.fn() } }));
const profile = { plan_id: 'new-plan', estado: 'pendiente', dia_actual: 1, fecha_inicio: '2026-01-01', dias_completados: 0, dias_totales: 30, racha_dias: 0, racha_maxima: 0, actividad_completada_hoy: false } as const;
const mount = () => render(<ThemeProvider><MemoryRouter><Dashboard /></MemoryRouter></ThemeProvider>);
beforeEach(() => { vi.clearAllMocks(); vi.mocked(planService.getProfile).mockResolvedValue(profile); vi.mocked(planService.getTodayPlan).mockResolvedValue({ plan_id: 'new-plan', dia_actual: 1, cabecera: null, contenido_especial: null, leccion: null }); });
test('abrir pendiente no lo activa; solo el botón activa y recarga perfil', async () => {
  const user = userEvent.setup(); mount();
  const button = await screen.findByRole('button', { name: 'Comenzar nuevo intento' });
  expect(planService.activateAttempt).not.toHaveBeenCalled(); expect(planService.getTodayPlan).not.toHaveBeenCalled();
  vi.mocked(planService.activateAttempt).mockResolvedValue({ plan_id: 'new-plan', estado: 'activo' });
  vi.mocked(planService.getProfile).mockResolvedValue({ ...profile, estado: 'activo' });
  await user.click(button);
  await screen.findByRole('button', { name: 'Lectura del día' });
  expect(planService.activateAttempt).toHaveBeenCalledWith('new-plan');
  expect(planService.getTodayPlan).toHaveBeenCalledTimes(1);
  expect(screen.queryByTitle('Avanzar día')).not.toBeInTheDocument();
});
test.each(['reiniciado', 'abandonado'] as const)('%s usa continuar para registros antiguos sin sucesor', async estado => {
  vi.mocked(planService.getProfile).mockResolvedValue({ ...profile, estado });
  const user = userEvent.setup(); mount(); await user.click(await screen.findByRole('button', { name: 'Comenzar nuevo intento' }));
  expect(planService.continueAttempt).toHaveBeenCalledTimes(1); expect(planService.activateAttempt).not.toHaveBeenCalled();
});
test('403 de activación explica el problema de tienda', async () => {
  vi.mocked(planService.activateAttempt).mockRejectedValue({ response: { status: 403 } });
  const user = userEvent.setup(); mount(); await user.click(await screen.findByRole('button', { name: 'Comenzar nuevo intento' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('tienda asociada no está activa');
});
test('409 de activación actualiza perfil sin repetir el POST', async () => {
  vi.mocked(planService.activateAttempt).mockRejectedValue({ response: { status: 409 } });
  const user = userEvent.setup(); mount(); await user.click(await screen.findByRole('button', { name: 'Comenzar nuevo intento' }));
  await waitFor(() => expect(planService.getProfile).toHaveBeenCalledTimes(2)); expect(planService.activateAttempt).toHaveBeenCalledTimes(1);
});

test('un historial que llega después de activar no se reutiliza en el intento nuevo', async () => {
  let resolveOld!: (value: any) => void;
  vi.mocked(planService.getDays).mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve; })).mockResolvedValueOnce({ dias: [] });
  vi.mocked(planService.activateAttempt).mockResolvedValue({ plan_id: 'new-plan', estado: 'activo' });
  const user = userEvent.setup(); mount(); await screen.findByRole('button', { name: 'Comenzar nuevo intento' });
  await user.click(screen.getByRole('button', { name: /Mis Actividades Diarias/ }));
  vi.mocked(planService.getProfile).mockResolvedValue({ ...profile, estado: 'activo' });
  await user.click(screen.getByRole('button', { name: 'Comenzar nuevo intento' }));
  await screen.findByRole('button', { name: 'Lectura del día' });
  await act(async () => resolveOld({ dias: [{ dia_numero: 5, completado: true }] }));
  await user.click(screen.getByRole('button', { name: /Mis Actividades Diarias/ }));
  expect(planService.getDays).toHaveBeenCalledTimes(2);
});

test('un 404 de contenido no invita a crear otro plan', async () => {
  vi.mocked(planService.getProfile).mockResolvedValue({ ...profile, estado: 'activo' });
  vi.mocked(planService.getTodayPlan).mockRejectedValue({ response: { status: 404 } });
  mount(); expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar tu programa');
  expect(planService.getBienvenida).not.toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: 'Iniciar test' })).not.toBeInTheDocument();
});
