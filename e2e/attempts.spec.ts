import { expect, test, type Page } from '@playwright/test';

const lesson = { dia_actual: 5, titulo: 'Un espacio para reflexionar', tipo: 'lectura', campos_respuesta: [{ id: 'reflection', tipo: 'texto', etiqueta: 'Mi reflexión' }], datos_leccion: { concepto: 'Reconoce lo que sientes y date tiempo para responder.', ejercicio: { nombre: 'Una pausa consciente', instruccion: 'Escribe cómo te sientes hoy.' } } };
async function auth(page: Page, role = 'usuario') {
  await page.addInitScript(() => { localStorage.setItem('access_token', 'test'); localStorage.setItem('refresh_token', 'test'); });
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/profile') return route.fulfill({ json: { id: 'test-user', nombre: 'Prueba local', rol: role } });
    if (path === '/api/plan/today') return route.fulfill({ json: { plan_id: 'plan-one', dia_actual: 5, leccion: lesson, conclusion: 'Un momento de reflexión para cerrar este bloque.' } });
    if (path === '/api/plan/profile') return route.fulfill({ json: { plan_id: 'plan-two', estado: 'pendiente', dia_actual: 1, dias_completados: 0, racha_dias: 0, racha_maxima: 0, fecha_inicio: '2026-01-01' } });
    return route.fulfill({ json: {} });
  });
}
async function finishReading(page: Page) {
  await page.locator('.overflow-y-auto').evaluateAll(elements => elements.forEach(el => { el.scrollTop = el.scrollHeight; el.dispatchEvent(new Event('scroll')); }));
}
test('cierre conserva contexto y borrador ante conflicto en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await auth(page);
  let payload: unknown;
  await page.route('**/api/plan/complete-day', route => { payload = route.request().postDataJSON(); return route.fulfill({ status: 409, json: { error: 'La actividad cambió' } }); });
  await page.goto('/lectura'); await page.getByRole('textbox', { name: 'Mi reflexión' }).fill('Mi respuesta conservada');
  await finishReading(page); await page.getByRole('button', { name: 'Continuar a reflexión final' }).click();
  await finishReading(page); await page.getByRole('button', { name: 'Finalizar y volver al inicio' }).click();
  await expect(page.getByText(/La actividad cambió/)).toBeVisible();
  expect(payload).toEqual({ plan_id: 'plan-one', dia_actual: 5, respuesta_usuario: [{ id: 'reflection', tipo: 'texto', valor: 'Mi respuesta conservada' }] });
  expect(await page.evaluate(() => localStorage.getItem('ien:activity-draft:v2:test-user:plan-one:5'))).toContain('Mi respuesta conservada');
  await expect(page.getByRole('button', { name: 'Finalizar y volver al inicio' })).toBeDisabled();
});
test('estado pendiente conserva la estética del dashboard en móvil', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 }); await auth(page); await page.goto('/dashboard');
  await expect(page.getByRole('button', { name: 'Comenzar nuevo intento' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: info.outputPath('dashboard-pendiente.png'), fullPage: true });
});
test('moderador usa simulación sin enviar respuestas a planes reales', async ({ page }, info) => {
  await auth(page, 'moderador_tienda'); let moves = 0; let realWrites = 0;
  await page.route('**/api/plan/complete-day', route => { realWrites++; return route.fulfill({ status: 500 }); });
  await page.route('**/api/admin/simulacion', route => {
    if (route.request().method() === 'POST') { expect(route.request().postDataJSON()).toEqual({ accion: 'avanzar', version: 0 }); moves++; }
    return route.fulfill({ json: { dia_actual: 5 + moves, version: moves, simulacion: true, leccion: { ...lesson, dia_actual: 5 + moves } } });
  });
  await page.goto('/admin/simulacion'); await expect(page.getByText('Modo simulación')).toBeVisible();
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: lesson.titulo })).toBeVisible();
  await expect(main.locator('.overflow-y-auto')).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('simulacion-escritorio.png') });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => localStorage.setItem('ien-theme', 'dark'));
  await page.reload();
  await expect(main.getByRole('heading', { name: lesson.titulo })).toBeVisible();
  expect(await main.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: info.outputPath('simulacion-movil-oscuro.png') });

  await page.getByRole('textbox', { name: 'Mi reflexión' }).fill('Prueba sin guardar');
  await finishReading(page); await page.getByRole('button', { name: 'Completar actividad' }).click();
  await expect(page.getByText('Día 6 de 30')).toBeVisible(); expect(moves).toBe(1); expect(realWrites).toBe(0);
  await expect.poll(() => main.evaluate(el => el.scrollTop)).toBe(0);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.includes('activity-draft')))).toEqual([]);
});
test('historial separa respuestas por intento y funciona en modo oscuro móvil', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 }); await auth(page, 'admin_negocio');
  await page.addInitScript(() => localStorage.setItem('ien-theme', 'dark'));
  const attempt = { _id: 'one', numero_intento: 1, estado: 'reiniciado', dia_actual: 6, fecha_inicio: '2026-01-01', racha_maxima: 5 };
  await page.route('**/api/admin/pacientes/patient/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/intentos/one')) return route.fulfill({ json: { ...attempt, progreso_diario: [{ dia_numero: 5, completado: true, respuesta_usuario: [{ id: 'reflection', valor: 'Respuesta del intento original' }], contenido_snapshot: lesson }] } });
    if (path.endsWith('/intentos')) return route.fulfill({ json: { intentos: [attempt, { ...attempt, _id: 'two', numero_intento: 2, estado: 'pendiente' }], total: 2, page: 1 } });
    if (path.endsWith('/perfil')) return route.fulfill({ json: { id: 'patient', nombre: 'Paciente de prueba', email: 'prueba@example.com', fecha_registro: '2026-01-01' } });
    return route.fulfill({ json: { estado: 'pendiente', dia_actual: 1, racha_dias: 0, racha_maxima: 0, progreso_diario: [] } });
  });
  await page.goto('/admin/pacientes/patient');
  await page.getByRole('button', { name: 'Historial de intentos' }).click();
  await page.getByRole('button', { name: /Intento 1/ }).click();
  await page.getByRole('button', { name: new RegExp(lesson.titulo) }).click();
  await expect(page.getByText('Respuesta del intento original')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: info.outputPath('historial-movil-oscuro.png'), fullPage: true });
});
