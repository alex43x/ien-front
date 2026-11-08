import { expect, test, type Page } from "@playwright/test";

async function authenticated(page: Page, role = "usuario") {
  await page.addInitScript(() => {
    localStorage.setItem("access_token", "test-access");
    localStorage.setItem("refresh_token", "test-refresh");
  });
  await page.route("**/api/**", async route => {
    const path = new URL(route.request().url()).pathname;
    let body: unknown = {};
    let status = 200;
    if (path === "/api/auth/profile") body = { id: "test-patient", nombre: "Paciente de prueba", email: "test@example.com", rol: role };
    else if (path === "/api/plan/today") body = {
      plan_id: "plan-a", dia_actual: 1, cabecera: null, conclusion: null, contenido_especial: null,
      leccion: { dia_actual: 1, titulo: "Actividad de prueba", tipo: "lectura", campos_respuesta: [{ id: "respuesta", tipo: "texto", etiqueta: "¿Cómo te sientes?" }], datos_leccion: { concepto: "Escucha tus emociones", ejercicio: { nombre: "Reflexión", instruccion: "Escribe o dicta tu respuesta." }, suplementacion: [{ nombre: "Magnesio", dosis: "Dosis de prueba", horario: "Noche", beneficio: "Descanso" }] } },
    };
    else if (path === "/api/plan/profile") body = { plan_id: "plan-a", dia_actual: 1, fecha_inicio: "2026-10-01T00:00:00.000Z", estado: "activo", dias_completados: 0, dias_totales: 30, racha_dias: 0, racha_maxima: 0, actividad_completada_hoy: false };
    else if (path === "/api/admin/productos") {
      if (route.request().method() === "POST") { status = 400; body = { error: "No se pudo guardar el producto de prueba" }; }
      else body = [];
    }
    await route.fulfill({ status, json: body });
  });
}

test("los textos de marca usan sus tonos legibles y el login cabe en móvil", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/login");
  const link = page.getByRole("button", { name: "¿La olvidaste?" });
  await expect(link).toBeVisible();
  expect(await link.evaluate(element => getComputedStyle(element).color)).toBe("rgb(122, 88, 0)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test("el botón final del registro tiene texto y fondo diferentes", async ({ page }) => {
  await page.addInitScript(() => {
    history.replaceState({ usr: { nombre: "Prueba", email: "test@example.com", password: "test-only-password", codigo_activacion: "ABC-123" }, key: "test", idx: 0 }, "");
  });
  await page.goto("/horario");
  const button = page.getByRole("button", { name: "Comenzar el programa" });
  await expect(button).toBeVisible();
  const colors = await button.evaluate(element => ({ text: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
  expect(colors.text).not.toBe(colors.background);
});

test("la respuesta diaria se recupera al recargar en móvil", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticated(page);
  await page.goto("/lectura");
  const input = page.getByRole("textbox", { name: "¿Cómo te sientes?" });
  await input.fill("Hoy me siento tranquilo.");
  await page.reload();
  await expect(input).toHaveValue("Hoy me siento tranquilo.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("el diálogo conserva datos tras un error y puede cerrarse con Escape", async ({ page }) => {
  await authenticated(page, "admin_negocio");
  await page.goto("/admin/productos");
  await page.getByRole("button", { name: "Nuevo producto" }).click();
  const dialog = page.getByRole("dialog", { name: "Nuevo producto" });
  const input = dialog.getByRole("textbox", { name: "Nombre", exact: true });
  await expect(input).toBeFocused();
  await input.fill("Producto de prueba");
  await input.press("Enter");
  await expect(dialog.getByRole("alert")).toContainText("No se pudo guardar");
  await expect(input).toHaveValue("Producto de prueba");
  await input.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Nuevo producto" })).toBeFocused();
});

test("las herramientas de plantillas se adaptan a móvil", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await authenticated(page, "admin_general");
  await page.goto("/admin/plantillas");
  await expect(page.getByRole("textbox", { name: "Nombre de ejemplo" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test("las marcas de suplementos se conservan después de recargar", async ({ page }) => {
  await authenticated(page);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Marcar Magnesio" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Desmarcar Magnesio" })).toHaveAttribute("aria-pressed", "true");
});

test("la preferencia de modo oscuro aplica los colores de texto correspondientes", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("ien-theme", "dark"));
  await page.goto("/login");
  const link = page.getByRole("button", { name: "¿La olvidaste?" });
  await expect(link).toBeVisible();
  expect(await link.evaluate(element => getComputedStyle(element).color)).toBe("rgb(240, 188, 72)");
});
