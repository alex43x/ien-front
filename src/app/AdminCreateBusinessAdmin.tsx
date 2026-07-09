import { useState, useEffect } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { Sucursal } from "../types/api.types";

export default function AdminCreateBusinessAdmin() {
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", tiendas_administradas: [] as string[] });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminService.listarSucursales()
      .then(setStores)
      .catch(console.error)
      .finally(() => setStoresLoading(false));
  }, []);

  const toggleTienda = (id: string) => {
    setForm((f) => ({
      ...f,
      tiendas_administradas: f.tiendas_administradas.includes(id)
        ? f.tiendas_administradas.filter((t) => t !== id)
        : [...f.tiendas_administradas, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nombre || !form.email || !form.password) {
      setError("Todos los campos son requeridos");
      return;
    }
    if (form.tiendas_administradas.length === 0) {
      setError("Debe asignar al menos una sucursal");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await adminService.crearAdminNegocio(form);
      setSuccess(`Admin de negocio "${form.nombre}" creado exitosamente`);
      setForm({ nombre: "", email: "", password: "", tiendas_administradas: [] });
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear admin de negocio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Administración</p>
        <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38] mt-1">Crear administrador de negocio</h1>
        <p className="text-sm text-[#7A7270] mt-1">Solo visible para admin general</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-6 space-y-5">
        {error && (
          <div className="rounded-2xl bg-[#FAEAEA] px-4 py-3 text-sm font-medium text-[#E96B6B]">{error}</div>
        )}
        {success && (
          <div className="rounded-2xl bg-[#E6F5F3] px-4 py-3 text-sm font-medium text-[#1E6860]">{success}</div>
        )}

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Nombre</label>
          <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
            placeholder="Nombre completo" />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
            placeholder="correo@ejemplo.com" />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Contraseña</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 pr-12 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
              placeholder="Mínimo 6 caracteres" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A7270]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Sucursales asignadas</label>
          {storesLoading ? (
            <div className="flex items-center gap-2 text-sm text-[#7A7270]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
              Cargando sucursales...
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-2xl border border-[#E0DAD4] p-3">
              {stores.map((s) => (
                <label key={s._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F5F4] cursor-pointer">
                  <input type="checkbox" checked={form.tiendas_administradas.includes(s._id)} onChange={() => toggleTienda(s._id)}
                    className="w-4 h-4 rounded border-[#E0DAD4] text-[#4DAAA0] focus:ring-[#4DAAA0]" />
                  <div>
                    <span className="text-sm text-[#3E3A38]">{s.nombre_tienda}</span>
                    <span className="text-xs text-[#7A7270] ml-2">{s.ciudad}</span>
                  </div>
                </label>
              ))}
              {stores.length === 0 && <p className="text-sm text-[#7A7270] py-2">No hay sucursales disponibles</p>}
            </div>
          )}
          {!storesLoading && (
            <p className="mt-1 text-[11px] text-[#7A7270]">{form.tiendas_administradas.length} sucursal(es) seleccionada(s)</p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#3E3A38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2F2B29] disabled:opacity-50 transition-all">
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              <UserPlus size={16} />
              Crear administrador
            </>
          )}
        </button>
      </form>
    </div>
  );
}
