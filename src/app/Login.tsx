import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Brain, Eye, EyeOff, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { C } from "@/constants/colors";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";

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
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,160,48,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(77,170,160,0.16),_transparent_22%),var(--background)] p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-border bg-card/80 shadow-[0_24px_80px_rgba(62,58,56,0.14)] backdrop-blur-xl">
        <div className="relative hidden flex-1 overflow-hidden bg-sidebar p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_35%)]" />
          <div className="absolute inset-0">
            <div className="absolute -left-20 top-[-72px] h-[320px] w-[320px] rounded-full border border-white/10" />
            <div className="absolute bottom-[-96px] right-[-80px] h-[360px] w-[360px] rounded-full border border-white/10" />
          </div>

          <div className="relative z-10">
            <img src="/imports/logo_ien-03.png" alt="IEN" className="h-14 w-auto opacity-90 brightness-0 invert" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              <Sparkles size={12} className="text-[#FAEAB0]" />
              Programa de 30 días
            </div>
            <h2 className="mt-6 font-['Lora'] text-4xl font-semibold leading-tight text-white">
              30 días para transformar tu relación con la comida y tu bienestar
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

        <div className="flex flex-1 items-center justify-center bg-secondary/50 p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <img src="/imports/logo_ien-03.png" alt="IEN" className="h-12 w-auto" />
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Acceso seguro
              </div>
              <h1 className="font-['Lora'] text-3xl font-semibold text-foreground">Hola de nuevo</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ingresa para continuar tu recorrido con un entorno claro, cálido y pensado para ti.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@ejemplo.com"
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    Contraseña
                  </label>
                  <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-medium text-primary transition hover:opacity-80">
                    ¿La olvidaste?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-semibold text-primary transition hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Con el apoyo de
              </p>
              <div className="flex items-center justify-center gap-12">
                <img src="/imports/cardiosmile.jpeg" alt="Cardiosmile" className="h-24 w-auto object-contain rounded-2xl" />
                <div className="h-20 w-px bg-border" />
                <img src="/imports/vitamin_shoppe.jpeg" alt="Vitamin Shoppe" className="h-24 w-auto object-contain rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
