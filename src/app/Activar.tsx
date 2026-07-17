import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowRight, Scan, ChevronLeft, Loader2 } from "lucide-react";
import { C } from "@/constants/colors";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function Activar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const regData = (location.state as { nombre?: string; email?: string; password?: string }) || {};
  const [codigoActivacion, setCodigoActivacion] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canContinue = codigoActivacion.trim().length > 0 && (regData.nombre && regData.email && regData.password);

  const handleSubmit = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await register({
        nombre: regData.nombre,
        email: regData.email,
        password: regData.password,
        codigo_activacion: codigoActivacion
      });
      navigate("/bienvenida");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear la cuenta.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/register")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </button>
          <img src="/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] flex items-center justify-center font-bold">2</span>
            Activación de productos
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="max-w-lg w-full">

          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Paso 2 de 2</p>
            <h1 className="font-['Lora'] text-2xl font-semibold text-foreground">Activa tus productos</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Introduce el código de activación que recibiste para comenzar el programa.
            </p>
          </div>

          {/* Activation code */}
          <div className="bg-card rounded-2xl border border-border p-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                <Scan size={15} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Código de activación</p>
            </div>
            <input
              type="text"
              value={codigoActivacion}
              onChange={(e) => { setCodigoActivacion(e.target.value); setError(""); }}
              placeholder="IEN-002"
              className="w-full text-center text-xl font-mono font-bold tracking-wider px-4 py-3 rounded-xl border-2 bg-secondary focus:outline-none transition-all"
              style={{
                borderColor: error ? C.red.color : undefined,
              }}
            />
          </div>

          {/* Continue */}
          <button
            disabled={!canContinue || submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Comenzar el programa
                <ArrowRight size={16} />
              </>
            )}
          </button>
          {!canContinue && (
            <p className="text-center text-xs font-mono text-muted-foreground mt-2">
              Ingresa un código de activación para continuar
            </p>
          )}
          {error && (
            <p className="text-center text-xs font-medium text-destructive mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
