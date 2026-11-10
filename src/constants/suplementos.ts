const PRODUCTOS = {
  ashwagandha: "https://www.vitaminshoppeparaguay.com.py/products/ashwagandha-extract-60-capsulas",
  "l-teanina": "https://www.vitaminshoppeparaguay.com.py/products/l-teanina-100-mg-60-capsulas-vegetarianas",
  magnesio: "https://www.vitaminshoppeparaguay.com.py/products/glicinato-de-magnesio-400mg-120-capsulas",
  rhodiola: "https://www.vitaminshoppeparaguay.com.py/products/rhodiola-rosea-500-mg-60-capsulas",
  "complejo b": "https://www.vitaminshoppeparaguay.com.py/products/complejo-b-bioactivo-coenzimas-activas-60-capsulas-vegetales",
  "omega-3": "https://www.vitaminshoppeparaguay.com.py/products/omega-3-fish-oil-1000-mg-300-200-epa-dha-60-capsulas-blandas",
  "coenzima q10": "https://www.vitaminshoppeparaguay.com.py/products/coq-10-100-mg-30-capsulas-blandas",
  coq10: "https://www.vitaminshoppeparaguay.com.py/products/coq-10-100-mg-30-capsulas-blandas",
  gaba: "https://www.vitaminshoppeparaguay.com.py/products/gaba-750-mg-90-tabletas",
  ginkgo: "https://www.vitaminshoppeparaguay.com.py/products/ginkgo-biloba-120-mg-60-capsulas",
  aminoacidos: "https://www.vitaminshoppeparaguay.com.py/products/superior-amino-2222-160-tabletas",
};

export const TEXTO_COMPRA_SUPLEMENTOS = "Selecciona un suplemento para acceder a su página de compra en The Vitamin Shoppe Paraguay.";

export function linksSuplemento(nombre: string): { nombre: string; url: string }[] {
  const links = new Map<string, { nombre: string; url: string }>();

  for (const parte of nombre.split("+")) {
    const etiqueta = parte.trim();
    const normalizada = etiqueta.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
    const producto = Object.entries(PRODUCTOS).find(([clave]) => normalizada.includes(clave));
    if (producto && !links.has(producto[1])) {
      links.set(producto[1], { nombre: etiqueta, url: producto[1] });
    }
  }

  return [...links.values()];
}
