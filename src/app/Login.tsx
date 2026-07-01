import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight, Brain, HeartHandshake, Sparkles } from "lucide-react";

const C = {
  yellow: { color: "#D9A030", bg: "#FEF7E0", soft: "#FAEAB0" },
  green:  { color: "#4DAAA0", bg: "#E6F5F3", soft: "#B8E8E2" },
  red:    { color: "#E96B6B", bg: "#FAEAEA", soft: "#F8D0D0" },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Completa todos los campos."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/bienvenida");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F4] flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #3E3A38 0%, #524E4C 100%)" }}>

        {/* Floating circles (brand icons) */}
        <div className="absolute inset-0">
          {/* large background ring */}
          <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full border border-white/5" />
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full border border-white/5" />
          <div className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full border border-white/5 translate-x-1/3 translate-y-1/3" />

          {/* Floating feature cards */}
          <div className="absolute top-[15%] left-[12%] w-48 rounded-2xl p-4 bg-white/8 backdrop-blur-sm border border-white/10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: C.yellow.soft }}>
              <Brain size={18} style={{ color: C.yellow.color }} />
            </div>
            <p className="text-white text-sm font-semibold">Autoconciencia</p>
            <p className="text-white/50 text-xs mt-0.5">Reconoce tus señales internas</p>
          </div>

          <div className="absolute top-[38%] left-[38%] w-48 rounded-2xl p-4 bg-white/8 backdrop-blur-sm border border-white/10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: C.green.soft }}>
              <HeartHandshake size={18} style={{ color: C.green.color }} />
            </div>
            <p className="text-white text-sm font-semibold">Empatía</p>
            <p className="text-white/50 text-xs mt-0.5">Trátate con amabilidad</p>
          </div>

          <div className="absolute top-[60%] left-[10%] w-48 rounded-2xl p-4 bg-white/8 backdrop-blur-sm border border-white/10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: C.red.soft }}>
              <Sparkles size={18} style={{ color: C.red.color }} />
            </div>
            <p className="text-white text-sm font-semibold">Autoconfianza</p>
            <p className="text-white/50 text-xs mt-0.5">De víctima a protagonista</p>
          </div>

          {/* Progress pill */}
          <div className="absolute bottom-[18%] right-[10%] w-52 rounded-2xl p-4 bg-white/8 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70 text-xs font-mono">Progreso del programa</p>
              <span className="text-xs font-mono font-semibold" style={{ color: C.yellow.color }}>37%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full" style={{ width: "37%", backgroundColor: C.yellow.color }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-white/40 text-[10px] font-mono">Día 11 de 30</span>
              <span className="text-white/40 text-[10px] font-mono">Bloque 3/6</span>
            </div>
          </div>
        </div>

        {/* Brand identity */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-14 w-auto brightness-0 invert opacity-80" />
          <div>
            <p className="font-['Lora'] text-4xl font-semibold text-white leading-tight mb-4">
              30 días para transformar<br />tu relación con la comida
            </p>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Inteligencia Emocional aplicada a la nutrición. Con el apoyo de Cardiosmile y Vitamin Shoppe.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Participantes", value: "2.400+" },
              { label: "Tasa de adherencia", value: "84%" },
              { label: "Bloques completados", value: "14.2K" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-['Lora'] text-xl font-semibold text-white">{s.value}</p>
                <p className="text-white/40 text-xs font-mono mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-12 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38]">Bienvenida de nuevo</h1>
            <p className="text-sm text-[#7A7270] mt-1">Accede a tu programa de 30 días</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-mono font-semibold text-[#3E3A38] uppercase tracking-wider mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl border text-sm text-[#3E3A38] placeholder-[#C0BCBA] bg-white focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: "rgba(62,58,56,0.15)",
                  fontFamily: "inherit",
                  focusRingColor: C.yellow.color,
                } as React.CSSProperties}
                onFocus={(e) => e.target.style.borderColor = C.yellow.color}
                onBlur={(e) => e.target.style.borderColor = "rgba(62,58,56,0.15)"}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold text-[#3E3A38] uppercase tracking-wider">
                  Contraseña
                </label>
                <button type="button" className="text-xs font-mono hover:underline" style={{ color: C.yellow.color }}>
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border text-sm text-[#3E3A38] placeholder-[#C0BCBA] bg-white focus:outline-none transition-all"
                  style={{ borderColor: "rgba(62,58,56,0.15)", fontFamily: "inherit" }}
                  onFocus={(e) => e.target.style.borderColor = C.yellow.color}
                  onBlur={(e) => e.target.style.borderColor = "rgba(62,58,56,0.15)"}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7270] hover:text-[#3E3A38] transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs font-mono px-3 py-2 rounded-lg" style={{ backgroundColor: C.red.bg, color: C.red.color }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ backgroundColor: "#3E3A38" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al programa
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(62,58,56,0.1)" }} />
            <span className="text-xs font-mono text-[#7A7270]">o</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(62,58,56,0.1)" }} />
          </div>

          {/* Register CTA */}
          <div className="text-center">
            <p className="text-sm text-[#7A7270]">
              ¿Aún no tienes cuenta?{" "}
              <button className="font-semibold hover:underline" style={{ color: C.yellow.color }}>
                Regístrate aquí
              </button>
            </p>
          </div>

          {/* Partner logos */}
          <div className="mt-10 pt-6 border-t border-[rgba(62,58,56,0.08)]">
            <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#7A7270] mb-3">Con el apoyo de</p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: C.red.soft }}>
                  <span style={{ color: C.red.color, fontSize: 10 }}>♥</span>
                </div>
                <span className="text-xs font-semibold text-[#3E3A38]">Cardiosmile</span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: "rgba(62,58,56,0.12)" }} />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: C.green.soft }}>
                  <span style={{ color: C.green.color, fontSize: 10 }}>+</span>
                </div>
                <span className="text-xs font-semibold text-[#3E3A38]">Vitamin Shoppe</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
