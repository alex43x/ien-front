import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowRight, Scan, ChevronLeft, Loader2 } from "lucide-react";
import { C } from "@/constants/colors";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/register")} className="text-[#7A7270] hover:text-[#3E3A38] transition-colors">
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
              Introduce el código de activación que recibiste para comenzar el programa.
            </p>
          </div>

          {/* Activation code */}
          <div className="bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] p-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.yellow.soft }}>
                <Scan size={15} style={{ color: C.yellow.color }} />
              </div>
              <p className="text-sm font-semibold text-[#3E3A38]">Código de activación</p>
            </div>
            <input
              type="text"
              value={codigoActivacion}
              onChange={(e) => { setCodigoActivacion(e.target.value); setError(""); }}
              placeholder="IEN-002"
              className="w-full text-center text-xl font-mono font-bold tracking-wider px-4 py-3 rounded-xl border-2 bg-[#F7F5F4] focus:outline-none transition-all"
              style={{
                borderColor: error ? C.red.color : "rgba(62,58,56,0.15)",
                color: "#3E3A38",
              }}
            />
          </div>

          {/* Continue */}
          <button
            disabled={!canContinue || submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#3E3A38" }}>
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
            <p className="text-center text-xs font-mono text-[#7A7270] mt-2">
              Ingresa un código de activación para continuar
            </p>
          )}
          {error && (
            <p className="text-center text-xs font-medium mt-2" style={{ color: C.red.color }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
