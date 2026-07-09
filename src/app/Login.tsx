import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Brain, Eye, EyeOff, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { C } from "@/constants/colors";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      // El PublicRoute nos va a redirigir al dashboard, 
      // pero por si acaso o si queremos forzar ir a bienvenida:
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,160,48,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(77,170,160,0.16),_transparent_22%),#F7F5F4] p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-[#E8E2DB] bg-white/80 shadow-[0_24px_80px_rgba(62,58,56,0.14)] backdrop-blur-xl">
        <div className="relative hidden flex-1 overflow-hidden bg-[#3E3A38] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_35%),linear-gradient(135deg,_#3E3A38_0%,_#524E4C_100%)]" />
          <div className="absolute inset-0">
            <div className="absolute -left-20 top-[-72px] h-[320px] w-[320px] rounded-full border border-white/10" />
            <div className="absolute bottom-[-96px] right-[-80px] h-[360px] w-[360px] rounded-full border border-white/10" />
          </div>

          <div className="relative z-10">
            <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-14 w-auto opacity-90 brightness-0 invert" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              <Sparkles size={12} className="text-[#FAEAB0]" />
              Programa de 30 días
            </div>
            <h2 className="mt-6 font-['Lora'] text-4xl font-semibold leading-tight text-white">
              30 días para transformar tu relación con la comida
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              Inteligencia emocional aplicada a la nutrición, con apoyo guiado y un enfoque humano para avanzar con calma.
            </p>
          </div>

          <div className="relative z-10 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Autoconciencia", text: "Reconoce tus señales internas", icon: Brain, color: C.yellow },
              { title: "Empatía", text: "Trátate con amabilidad", icon: HeartHandshake, color: C.green },
              { title: "Confianza", text: "Avanza con seguridad", icon: ShieldCheck, color: C.red },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: item.color.soft }}>
                    <Icon size={16} style={{ color: item.color.color }} />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-white/55">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[#FCFAF8] p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-12 w-auto" />
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center rounded-full border border-[#E7DDCF] bg-[#FEF7E0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D9A030]">
                Acceso seguro
              </div>
              <h1 className="font-['Lora'] text-3xl font-semibold text-[#3E3A38]">Bienvenida de nuevo</h1>
              <p className="mt-2 text-sm leading-6 text-[#7A7270]">
                Ingresa para continuar tu recorrido con un entorno claro, cálido y pensado para ti.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@ejemplo.com"
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] placeholder-[#C0BCBA] shadow-sm transition-all focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-medium text-[#D9A030] transition hover:opacity-80">
                    ¿La olvidaste?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 pr-12 text-sm text-[#3E3A38] placeholder-[#C0BCBA] shadow-sm transition-all focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7270] transition hover:text-[#3E3A38]"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-[#FAEAEA] px-3 py-2 text-xs font-medium text-[#E96B6B]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3E3A38] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3E3A38]/15 transition-all hover:-translate-y-0.5 hover:bg-[#2F2B29] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Entrar al programa
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E8E2DB]" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#7A7270]">o</span>
              <div className="h-px flex-1 bg-[#E8E2DB]" />
            </div>

            <div className="text-center">
              <p className="text-sm text-[#7A7270]">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-semibold text-[#D9A030] transition hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <div className="mt-8 border-t border-[#E8E2DB] pt-6">
              <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7A7270]">
                Con el apoyo de
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-[#3E3A38]">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FAEAEA] text-[10px] text-[#E96B6B]">♥</div>
                  <span className="font-semibold">Cardiosmile</span>
                </div>
                <div className="h-4 w-px bg-[#E8E2DB]" />
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#E6F5F3] text-[10px] text-[#4DAAA0]">+</div>
                  <span className="font-semibold">Vitamin Shoppe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
