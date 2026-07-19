import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ArrowLeft, Mail, CheckCircle, RotateCw } from "lucide-react";
import { authService } from "../services/auth.service";
import { ThemeToggle } from "../components/ui/ThemeToggle";

const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = "ien_forgot_pw_cooldown";

function getRemainingCooldown(): number {
  const end = localStorage.getItem(COOLDOWN_KEY);
  if (!end) return 0;
  const remaining = Math.ceil((Number(end) - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

function setCooldownEnd() {
  localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_SECONDS * 1000));
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(getRemainingCooldown);

  useEffect(() => {
    if (cooldown <= 0) {
      localStorage.removeItem(COOLDOWN_KEY);
      return;
    }
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (getRemainingCooldown() > 0) setSent(true);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Ingresá tu correo electrónico.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      setCooldownEnd();
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al enviar el enlace.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleResend = () => {
    if (cooldown > 0 || loading) return;
    handleSubmit();
  };

  const cooldownLabel = cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar enlace";

  if (sent) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle size={32} className="text-accent" />
            </div>
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Revisá tu correo</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Si <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Revisá la carpeta de spam si no lo ves en tu bandeja.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                ) : (
                  <>
                    <RotateCw size={15} />
                    {cooldownLabel}
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <ArrowLeft size={15} />
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Volver
          </button>
        </div>

        <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Recuperación
            </div>
            <h1 className="font-['Lora'] text-3xl font-semibold text-foreground">¿Olvidaste tu contraseña?</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ingresá tu correo electrónico y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maria@ejemplo.com"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
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
                  Enviar enlace de recuperación
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Recordás tu contraseña?{' '}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-primary transition hover:underline"
              >
                Iniciá sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
