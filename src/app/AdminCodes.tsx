import { useState, useEffect } from "react";
import { Plus, Power, PowerOff } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { CodigoActivacion, Sucursal } from "../types/api.types";

export default function AdminCodes() {
  const [codes, setCodes] = useState<CodigoActivacion[]>([]);
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ codigo: "", producto_id: "", tienda_id: "" });

  const fetchData = async () => {
    try {
      const [c, s] = await Promise.all([
        adminService.listarCodigos(),
        adminService.listarSucursales(),
      ]);
      setCodes(c);
      setStores(s);
    } catch (err) {
      console.error("Error fetching codes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      await adminService.crearCodigo(form);
      setShowForm(false);
      setForm({ codigo: "", producto_id: "", tienda_id: "" });
      await fetchData();
    } catch (err) {
      console.error("Error creating code", err);
    }
  };

  const toggleCode = async (code: CodigoActivacion) => {
    try {
      if (code.activo) {
        await adminService.desactivarCodigo(code._id);
      } else {
        await adminService.activarCodigo(code._id);
      }
      await fetchData();
    } catch (err) {
      console.error("Error toggling code", err);
    }
  };

  const getTiendaNombre = (code: CodigoActivacion) => {
    const t = code.tienda_id;
    return typeof t === "object" && t !== null ? t.nombre_tienda : "—";
  };

  const getProductoNombre = (code: CodigoActivacion) => {
    const p = code.producto_id;
    return typeof p === "object" && p !== null ? p.nombre : "—";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#D9A030]/30 border-t-[#D9A030]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#7A7270]">Gestión</p>
          <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38] mt-1">Códigos de activación</h1>
          <p className="text-sm text-[#7A7270] mt-1">{codes.length} códigos · {codes.filter((c) => c.activo).length} activos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#3E3A38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2F2B29] transition-all"
        >
          <Plus size={16} />
          Nuevo código
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mb-4">Nuevo código de activación</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Código</label>
                <input type="text" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] font-mono focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                  placeholder="Ej: IEN-ABCD-1234" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Sucursal</label>
                <select value={form.tienda_id} onChange={(e) => setForm({ ...form, tienda_id: e.target.value })}
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15">
                  <option value="">Seleccionar sucursal</option>
                  {stores.map((s) => <option key={s._id} value={s._id}>{s.nombre_tienda}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Producto ID</label>
                <input type="text" value={form.producto_id} onChange={(e) => setForm({ ...form, producto_id: e.target.value })}
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                  placeholder="ID del producto" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 rounded-2xl border border-[#E0DAD4] px-4 py-3 text-sm font-semibold text-[#7A7270] hover:bg-[#F0EDEC] transition-all">Cancelar</button>
                <button onClick={handleSave} disabled={!form.codigo || !form.tienda_id || !form.producto_id} className="flex-1 rounded-2xl bg-[#3E3A38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2F2B29] disabled:opacity-50 transition-all">Crear código</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[#3E3A38]">
            <thead>
              <tr className="border-b border-[rgba(62,58,56,0.08)] bg-[#F7F5F4] text-[10px] uppercase tracking-wider text-[#7A7270]">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Sucursal</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Creado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(62,58,56,0.08)]">
              {codes.map((code) => {
                const activo = code.activo;
                return (
                  <tr key={code._id} className="hover:bg-[#F7F5F4]">
                    <td className="py-4 px-4 font-mono font-medium text-[#3E3A38]">{code.codigo}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{getTiendaNombre(code)}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{getProductoNombre(code)}</td>
                    <td className="py-4 px-4 text-[#7A7270]">{new Date(code.fecha_creacion).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${activo ? "bg-[#E6F5F3] text-[#1E6860]" : "bg-[#FAEAEA] text-[#8A2828]"}`}>
                        {activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleCode(code)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all ${activo ? "bg-[#FAEAEA] text-[#E96B6B] hover:bg-[#F8D0D0]" : "bg-[#E6F5F3] text-[#4DAAA0] hover:bg-[#B8E8E2]"}`}
                      >
                        {activo ? <PowerOff size={12} /> : <Power size={12} />}
                        {activo ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-[#7A7270]">No hay códigos registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
