import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Package } from "lucide-react";
import { adminService } from "../services/admin.service";
import type { ProductoAdmin, Sucursal } from "../types/api.types";

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductoAdmin | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tiendas: [] as string[] });

  const fetchData = async () => {
    try {
      const [p, s] = await Promise.all([
        adminService.listarProductos(),
        adminService.listarSucursales(),
      ]);
      setProducts(p);
      setStores(s);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await adminService.actualizarProducto(editing._id, form);
      } else {
        await adminService.crearProducto(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ nombre: "", descripcion: "", tiendas: [] });
      await fetchData();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleEdit = (product: ProductoAdmin) => {
    const tiendas = Array.isArray(product.tiendas)
      ? product.tiendas.map((t: any) => (typeof t === "string" ? t : t._id))
      : [];
    setEditing(product);
    setForm({ nombre: product.nombre, descripcion: product.descripcion || "", tiendas });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await adminService.eliminarProducto(id);
      await fetchData();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const toggleTienda = (id: string) => {
    setForm((f) => ({
      ...f,
      tiendas: f.tiendas.includes(id) ? f.tiendas.filter((t) => t !== id) : [...f.tiendas, id],
    }));
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
          <h1 className="font-['Lora'] text-2xl font-semibold text-[#3E3A38] mt-1">Productos</h1>
          <p className="text-sm text-[#7A7270] mt-1">{products.length} productos registrados</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ nombre: "", descripcion: "", tiendas: [] }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-[#3E3A38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2F2B29] transition-all"
        >
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-['Lora'] text-lg font-semibold text-[#3E3A38] mb-4">{editing ? "Editar producto" : "Nuevo producto"}</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Nombre</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                  placeholder="Nombre del producto" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Descripción</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full rounded-2xl border border-[#E0DAD4] bg-white px-4 py-3 text-sm text-[#3E3A38] focus:border-[#D9A030] focus:outline-none focus:ring-4 focus:ring-[#D9A030]/15"
                  placeholder="Descripción opcional" rows={3} />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3E3A38]">Sucursales</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {stores.map((s) => (
                    <label key={s._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F5F4] cursor-pointer">
                      <input type="checkbox" checked={form.tiendas.includes(s._id)} onChange={() => toggleTienda(s._id)}
                        className="w-4 h-4 rounded border-[#E0DAD4] text-[#4DAAA0] focus:ring-[#4DAAA0]" />
                      <span className="text-sm text-[#3E3A38]">{s.nombre_tienda}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 rounded-2xl border border-[#E0DAD4] px-4 py-3 text-sm font-semibold text-[#7A7270] hover:bg-[#F0EDEC] transition-all">Cancelar</button>
                <button onClick={handleSave} disabled={!form.nombre} className="flex-1 rounded-2xl bg-[#3E3A38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2F2B29] disabled:opacity-50 transition-all">
                  {editing ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const tiendasNombres = Array.isArray(product.tiendas)
            ? product.tiendas.map((t: any) => (typeof t === "string" ? t : t.nombre_tienda)).filter(Boolean)
            : [];
          return (
            <div key={product._id} className="bg-white rounded-3xl border border-[rgba(62,58,56,0.09)] p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#FEF7E0] text-[#D9A030]">
                  <Package size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(product)} className="p-2 rounded-xl text-[#7A7270] hover:bg-[#F0EDEC] transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 rounded-xl text-[#7A7270] hover:bg-[#FAEAEA] hover:text-[#E96B6B] transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-[#3E3A38]">{product.nombre}</h3>
              {product.descripcion && <p className="mt-1 text-sm text-[#7A7270]">{product.descripcion}</p>}
              {tiendasNombres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tiendasNombres.map((name: string, i: number) => (
                    <span key={i} className="rounded-full bg-[#F0EDEC] px-2.5 py-1 text-[10px] font-medium text-[#7A7270]">{name}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[#7A7270]">No hay productos registrados</div>
        )}
      </div>
    </div>
  );
}
