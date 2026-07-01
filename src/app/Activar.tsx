import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, CheckCircle2, AlertCircle, Heart, Package, Scan, ChevronLeft } from "lucide-react";

const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", soft: "#FAEAB0", text: "#7A5800" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", soft: "#B8E8E2", text: "#1E6860" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", soft: "#F8D0D0", text: "#8A2828" },
};

// Simulated product catalog
const PRODUCTS: Record<string, { name: string; brand: string; desc: string; tone: "red" | "green"; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  "1001": { name: "Omega-3 Concentrado",    brand: "Cardiosmile",    desc: "Cuidado cardiovascular · 1 sobre diario con el desayuno",      tone: "red",   icon: Heart },
  "1002": { name: "CoQ10 + Magnesio",       brand: "Cardiosmile",    desc: "Soporte cardiovascular · 1 cápsula diaria con la cena",         tone: "red",   icon: Heart },
  "2001": { name: "Multivitamínico",        brand: "Vitamin Shoppe", desc: "Bienestar integral · 2 cápsulas diarias, mañana y noche",       tone: "green", icon: Package },
  "2002": { name: "Ashwagandha KSM-66",     brand: "Vitamin Shoppe", desc: "Regulación del cortisol · 600 mg diarios, antes de dormir",    tone: "green", icon: Package },
  "2003": { name: "Zinc + Selenio",         brand: "Vitamin Shoppe", desc: "Inmunidad y función tiroidea · 1 cápsula diaria con comida",   tone: "green", icon: Package },
};

const STORES: Record<string, string> = {
  "1001": "Cardiosmile — Farmacia Santa Isabel",
  "1002": "Cardiosmile — Cruz Verde",
  "2001": "Vitamin Shoppe — Mall Costanera",
  "2002": "Vitamin Shoppe — Online",
  "9999": "Código de demostración",
};

interface Activated {
  code: string;
  store: string;
  product: typeof PRODUCTS[string];
}

export default function Activar() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [activated, setActivated] = useState<Activated[]>([]);
  const [preview, setPreview] = useState<typeof PRODUCTS[string] | null>(null);
  const [storeLabel, setStoreLabel] = useState("");

  const format = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = format(e.target.value);
    setInput(formatted);
    setError("");
    setPreview(null);
    setStoreLabel("");

    if (formatted.length === 9) {
      const [storeCode, productCode] = formatted.split("-");
      const product = PRODUCTS[productCode];
      const store = STORES[storeCode];
      if (product && store) {
        setPreview(product);
        setStoreLabel(store);
      } else {
        setError("Código no reconocido. Verifica los números del envase.");
      }
    }
  };

  const handleActivate = () => {
    if (!preview || !storeLabel) return;
    const already = activated.find((a) => a.code === input);
    if (already) { setError("Este producto ya fue activado."); return; }
    setActivated((prev) => [...prev, { code: input, store: storeLabel, product: preview }]);
    setInput("");
    setPreview(null);
    setStoreLabel("");
  };

  const canContinue = activated.length > 0;

  return (
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/bienvenida")} className="text-[#7A7270] hover:text-[#3E3A38] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#7A7270]">
          <span className="w-4 h-4 rounded-full bg-[#3E3A38] text-white text-[9px] flex items-center justify-center font-bold">2</span>
          Activación de productos
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="max-w-lg w-full">

          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-1">Paso 2 de 2</p>
            <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38]">Activa tus productos</h1>
            <p className="text-sm text-[#7A7270] mt-2 leading-relaxed">
              Introduce el código de 8 dígitos que encontrarás en el envase de tu suplemento. Los primeros 4 identifican tu punto de venta y los últimos 4 el producto.
            </p>
          </div>

          {/* Code format explainer */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.yellow.soft }}>
                <Scan size={15} style={{ color: C.yellow.color }} />
              </div>
              <p className="text-sm font-semibold text-[#3E3A38]">Formato del código</p>
            </div>

            {/* Visual format diagram */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex-1 text-center">
                <div className="h-11 rounded-xl flex items-center justify-center text-lg font-mono font-bold tracking-widest border-2"
                  style={{ backgroundColor: C.yellow.bg, borderColor: C.yellow.border ?? C.yellow.soft, color: C.yellow.color }}>
                  XXXX
                </div>
                <p className="text-[10px] font-mono mt-1.5" style={{ color: C.yellow.text }}>Punto de venta</p>
              </div>
              <div className="text-xl font-light text-[#C0BCBA] mb-4 px-1">—</div>
              <div className="flex-1 text-center">
                <div className="h-11 rounded-xl flex items-center justify-center text-lg font-mono font-bold tracking-widest border-2"
                  style={{ backgroundColor: C.green.bg, borderColor: C.green.soft, color: C.green.color }}>
                  XXXX
                </div>
                <p className="text-[10px] font-mono mt-1.5" style={{ color: C.green.text }}>Producto</p>
              </div>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={input}
                onChange={handleChange}
                placeholder="0000-0000"
                maxLength={9}
                className="w-full text-center text-2xl font-mono font-bold tracking-[0.25em] px-4 py-4 rounded-xl border-2 bg-[#F7F5F4] focus:outline-none transition-all"
                style={{
                  borderColor: error ? C.red.color : preview ? C.green.color : "rgba(62,58,56,0.15)",
                  color: "#3E3A38",
                }}
              />
            </div>

            {/* Status feedback */}
            {error && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: C.red.bg }}>
                <AlertCircle size={14} style={{ color: C.red.color }} />
                <p className="text-xs font-mono" style={{ color: C.red.color }}>{error}</p>
              </div>
            )}

            {preview && !error && (
              <div className="mt-3 rounded-xl border p-4" style={{ backgroundColor: C[preview.tone].bg, borderColor: C[preview.tone].soft }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C[preview.tone].soft }}>
                    <preview.icon size={16} style={{ color: C[preview.tone].color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#3E3A38]">{preview.name}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: C[preview.tone].text }}>{preview.brand}</p>
                    <p className="text-xs text-[#7A7270] mt-1">{preview.desc}</p>
                    <p className="text-[10px] font-mono mt-2 text-[#7A7270]">Vendido en: {storeLabel}</p>
                  </div>
                  <CheckCircle2 size={18} style={{ color: C[preview.tone].color }} className="flex-shrink-0 mt-0.5" />
                </div>
                <button
                  onClick={handleActivate}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: C[preview.tone].color }}>
                  Añadir este producto
                </button>
              </div>
            )}
          </div>

          {/* Activated list */}
          {activated.length > 0 && (
            <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270] mb-3">
                Productos activados ({activated.length})
              </p>
              <div className="space-y-2">
                {activated.map((a, i) => {
                  const tone = C[a.product.tone];
                  const Icon = a.product.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: tone.bg }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tone.soft }}>
                        <Icon size={14} style={{ color: tone.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#3E3A38] truncate">{a.product.name}</p>
                        <p className="text-[10px] font-mono" style={{ color: tone.text }}>{a.product.brand} · {a.code}</p>
                      </div>
                      <CheckCircle2 size={15} style={{ color: tone.color }} className="flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => { setInput(""); setPreview(null); setError(""); }}
                className="mt-3 w-full text-center text-xs font-mono text-[#7A7270] hover:text-[#3E3A38] transition-colors">
                + Añadir otro producto
              </button>
            </div>
          )}

          {/* Continue */}
          <button
            disabled={!canContinue}
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#3E3A38" }}>
            Comenzar el programa
            <ArrowRight size={16} />
          </button>
          {!canContinue && (
            <p className="text-center text-xs font-mono text-[#7A7270] mt-2">
              Activa al menos un producto para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
