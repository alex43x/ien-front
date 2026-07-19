import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle, AlertTriangle } from "lucide-react";
import { authService } from "../services/auth.service";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      return;
    }
    authService
      .verifyResetToken(token)
      .then((res) => {
        setTokenValid(res.valido);
        setMaskedEmail(res.email || "");
      })
      .catch(() => {
        setTokenValid(false);
      })
      .finally(() => setVerifying(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Completá ambos campos.");
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
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Contraseña actualizada</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ya podés iniciar sesión con tu nueva contraseña.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <ArrowRight size={15} />
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md text-center">
          <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle size={32} className="text-destructive" />
            </div>
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Enlace inválido o expirado</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El enlace de recuperación no es válido o ya expiró (15 minutos). Solicitá uno nuevo.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              Solicitar nuevo enlace
            </button>
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
            Volver al inicio de sesión
          </button>
        </div>

        <div className="rounded-[32px] border border-border bg-card/80 p-8 shadow-sm">
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              Nueva contraseña
            </div>
            <h1 className="font-['Lora'] text-3xl font-semibold text-foreground">Restablecé tu contraseña</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {maskedEmail && (
                <>Enviado a <strong>{maskedEmail}</strong>. </>
              )}
              Elegí una contraseña nueva con al menos 8 caracteres.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Nueva contraseña
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
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

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-12 text-sm text-foreground placeholder-muted-foreground/50 shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
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
                  Guardar nueva contraseña
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
