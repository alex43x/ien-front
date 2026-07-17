import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, Sparkles, UserRound } from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    navigate("/activar", { state: { nombre: name, email, password } });
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
            <div className="absolute -left-16 top-[-72px] h-[280px] w-[280px] rounded-full border border-white/10" />
            <div className="absolute bottom-[-92px] right-[-80px] h-[320px] w-[320px] rounded-full border border-white/10" />
          </div>

          <div className="relative z-10">
            <img src="/imports/logo_ien-03.png" alt="IEN" className="h-14 w-auto opacity-90 brightness-0 invert" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              <Sparkles size={12} className="text-[#FAEAB0]" />
              Crea tu acceso
            </div>
            <h2 className="mt-6 font-['Lora'] text-4xl font-semibold leading-tight text-white">
              Únete al programa y empieza tu proceso con apoyo
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              Registrarte te permite seguir el recorrido paso a paso, con una experiencia más clara y acompañada.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAEAB0]">
                <CheckCircle2 size={20} className="text-[#D9A030]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Tu espacio personal</p>
                <p className="text-[11px] leading-5 text-white/60">Accede a recursos, actividades y seguimiento del programa.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center bg-secondary/50 p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <img src="/imports/logo_ien-03.png" alt="IEN" className="h-12 w-auto" />
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                Registro
              </div>
              <h1 className="font-['Lora'] text-3xl font-semibold text-foreground">Crea tu cuenta</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Completa tus datos para comenzar tu recorrido con confianza.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Nombre completo
                </label>
                <div className="relative">
                  <UserRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="María Pérez"
                    className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria@ejemplo.com"
                    className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                Crear cuenta
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => navigate("/login")} className="font-semibold text-primary transition hover:underline">
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
