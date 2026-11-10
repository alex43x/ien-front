import { expect, test } from "vitest";
import { linksSuplemento, separarSuplementos, urlSuplemento } from "../constants/suplementos";

const tienda = "https://www.vitaminshoppeparaguay.com.py/products/";

test.each([
  ["Ashwagandha", [["Ashwagandha", "ashwagandha-extract-60-capsulas"]]],
  ["Ashwagandha + Complejo B + Omega-3", [
    ["Ashwagandha", "ashwagandha-extract-60-capsulas"],
    ["Complejo B", "complejo-b-bioactivo-coenzimas-activas-60-capsulas-vegetales"],
    ["Omega-3", "omega-3-fish-oil-1000-mg-300-200-epa-dha-60-capsulas-blandas"],
  ]],
  ["Omega-3 (EPA/DHA)", [["Omega-3 (EPA/DHA)", "omega-3-fish-oil-1000-mg-300-200-epa-dha-60-capsulas-blandas"]]],
  ["Coenzima Q10", [["Coenzima Q10", "coq-10-100-mg-30-capsulas-blandas"]]],
  ["CoQ10", [["CoQ10", "coq-10-100-mg-30-capsulas-blandas"]]],
  ["Melatonina", []],
  ["Cardiosmile + CoQ10", [["CoQ10", "coq-10-100-mg-30-capsulas-blandas"]]],
  [" Aminoácidos + AMINOACIDOS ", [["Aminoácidos", "superior-amino-2222-160-tabletas"]]],
  ["CoQ10 + Coenzima Q10", [["CoQ10", "coq-10-100-mg-30-capsulas-blandas"]]],
] satisfies [string, [string, string][]][])("resuelve los enlaces de %s", (entrada, productos) => {
  expect(linksSuplemento(entrada)).toEqual(productos.map(([nombre, ruta]) => ({ nombre, url: tienda + ruta })));
});

const datos = { dosis: "1", horario: "Mañana", beneficio: "x" };

test("separa las combinaciones conservando los datos de cada suplemento", () => {
  expect(separarSuplementos([{ ...datos, nombre: "Complejo B + Ashwagandha" }])).toEqual([
    { ...datos, nombre: "Complejo B" },
    { ...datos, nombre: "Ashwagandha" },
  ]);
});

test("conserva un suplemento individual y descarta partes vacías", () => {
  const suplemento = { ...datos, nombre: "Ashwagandha" };
  expect(separarSuplementos([suplemento])).toEqual([suplemento]);
  expect(separarSuplementos([{ ...datos, nombre: "+ Ashwagandha + " }])).toEqual([suplemento]);
});

test("devuelve la URL de compra solo cuando hay un producto asociado", () => {
  expect(urlSuplemento("Ashwagandha")).toBe(tienda + "ashwagandha-extract-60-capsulas");
  expect(urlSuplemento("Melatonina")).toBeUndefined();
});
