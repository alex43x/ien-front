import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, expect, test, vi } from 'vitest';
import AttemptHistory from '../components/AttemptHistory';
import { attemptsService, type AttemptSummary, type AttemptDetail } from '../services/attempts.service';
import { ThemeProvider } from '../context/ThemeContext';
vi.mock('../services/attempts.service', () => ({ attemptsService: { list: vi.fn(), detail: vi.fn() } }));
const summary: AttemptSummary = { _id: 'p1', numero_intento: 1, estado: 'reiniciado', fecha_inicio: '2026-01-01', dia_actual: 3, racha_dias: 0, racha_maxima: 2 };
const detail: AttemptDetail = { ...summary, progreso_diario: [{ dia_numero: 1, completado: true, fecha_completado: '2026-01-01', respuesta_usuario: [{ id: 'reflection', valor: { texto: 'Respuesta conservada', lista: ['Uno', 'Dos'] } }] }] };
const view = (id: string) => <ThemeProvider><MemoryRouter><AttemptHistory key={id} userId={id} /></MemoryRouter></ThemeProvider>;
beforeEach(() => { vi.clearAllMocks(); vi.mocked(attemptsService.list).mockResolvedValue({ intentos: [summary], total: 21, page: 1 }); vi.mocked(attemptsService.detail).mockResolvedValue(detail); });
test('muestra respuestas antiguas de objetos y listas sin requerir snapshot', async () => {
  const user = userEvent.setup(); render(view('user-a'));
  await user.click(await screen.findByRole('button', { name: /Intento 1/ }));
  await user.click(await screen.findByRole('button', { name: /Día 1/ }));
  expect(await screen.findByText(/Respuesta conservada/)).toBeVisible();
  expect(screen.getByText(/Dos/)).toBeVisible();
});
test('cambiar de página descarta un detalle que llega tarde', async () => {
  let resolve!: (value: AttemptDetail) => void;
  vi.mocked(attemptsService.detail).mockReturnValue(new Promise(r => { resolve = r; }));
  const user = userEvent.setup(); render(view('user-a'));
  await user.click(await screen.findByRole('button', { name: /Intento 1/ }));
  await user.click(screen.getByRole('button', { name: 'Siguiente' }));
  await act(async () => resolve(detail));
  expect(screen.queryByText('Actividades de este intento')).not.toBeInTheDocument();
  expect(attemptsService.list).toHaveBeenLastCalledWith('user-a', 2);
});
test('cambiar de paciente descarta la lista anterior en curso', async () => {
  let resolve!: (value: any) => void;
  vi.mocked(attemptsService.list).mockReturnValueOnce(new Promise(r => { resolve = r; })).mockResolvedValueOnce({ intentos: [], total: 0, page: 1 });
  const mounted = render(view('user-a')); mounted.rerender(view('user-b'));
  await screen.findByText('Todavía no hay intentos registrados.');
  await act(async () => resolve({ intentos: [summary], total: 1, page: 1 }));
  expect(screen.queryByRole('button', { name: /Intento 1/ })).not.toBeInTheDocument();
});
test.each([403, 404])('muestra un error de detalle %i sin ocultar la lista', async status => {
  vi.mocked(attemptsService.detail).mockRejectedValue({ response: { status } });
  const user = userEvent.setup(); render(view('user-a'));
  await user.click(await screen.findByRole('button', { name: /Intento 1/ }));
  expect(await screen.findByRole('alert')).toHaveTextContent(status === 403 ? 'No tienes acceso' : 'no está disponible');
  expect(screen.getByRole('button', { name: /Intento 1/ })).toBeVisible();
});
