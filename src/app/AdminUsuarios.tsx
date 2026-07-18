import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Shield,
  UserCog,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import type {
  AdminNegocioItem,
  ModeradorTiendaItem,
  Sucursal,
} from "../types/api.types";
import { useAuth } from "../context/AuthContext";

type Tab = "admins" | "moderadores";

export default function AdminUsuarios() {
  const { user } = useAuth();
  const isGeneral = user?.rol === "admin_general";

  const [tab, setTab] = useState<Tab>(isGeneral ? "admins" : "moderadores");

  // ── Data ──────────────────────────────────────────────────────────────
  const [admins, setAdmins] = useState<AdminNegocioItem[]>([]);
  const [moderadores, setModeradores] = useState<ModeradorTiendaItem[]>([]);
  const [stores, setStores] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [storesLoading, setStoresLoading] = useState(true);

  // ── Form state ────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminNegocioItem | ModeradorTiendaItem | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    tiendas_administradas: [] as string[],
    tienda_id: "",
  });

  // ── Fetch ─────────────────────────────────────────────────────────────
  const fetchAdmins = async () => {
    try {
      const data = await adminService.listarAdminsNegocio();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins", err);
    }
  };

  const fetchModeradores = async () => {
    try {
      const data = await adminService.listarModeradores();
      setModeradores(data);
    } catch (err) {
      console.error("Error fetching moderadores", err);
    }
  };

  const fetchStores = async () => {
    try {
      const data = await adminService.listarSucursales();
      setStores(data);
    } catch (err) {
      console.error("Error fetching stores", err);
    } finally {
      setStoresLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchAdmins(), fetchModeradores(), fetchStores()])
      .finally(() => setLoading(false));
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm({ nombre: "", email: "", password: "", tiendas_administradas: [], tienda_id: "" });
    setEditing(null);
    setShowPw(false);
    setError("");
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditAdmin = (item: AdminNegocioItem) => {
    setEditing(item);
    setForm({
      nombre: item.nombre,
      email: item.email,
      password: "",
      tiendas_administradas: item.tiendas_administradas.map((t) => t._id),
      tienda_id: "",
    });
    setShowPw(false);
    setError("");
    setShowForm(true);
  };

  const handleEditModerador = (item: ModeradorTiendaItem) => {
    setEditing(item);
    setForm({
      nombre: item.nombre,
      email: item.email,
      password: "",
      tiendas_administradas: [],
      tienda_id: item.tienda_moderada?._id || "",
    });
    setShowPw(false);
    setError("");
    setShowForm(true);
  };

  // ── Toggle tienda checkbox (admin negocio) ────────────────────────────
  const toggleTienda = (id: string) => {
    setForm((f) => ({
      ...f,
      tiendas_administradas: f.tiendas_administradas.includes(id)
        ? f.tiendas_administradas.filter((t) => t !== id)
        : [...f.tiendas_administradas, id],
    }));
  };

  // ── Save ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError("");

    if (tab === "admins") {
      if (!form.nombre || !form.email) {
        setError("Nombre y email son requeridos");
        return;
      }
      if (!editing && !form.password) {
        setError("La contraseña es requerida");
        return;
      }
      if (!editing && form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (form.tiendas_administradas.length === 0) {
        setError("Debe asignar al menos una sucursal");
        return;
      }

      try {
        if (editing) {
          await adminService.actualizarAdminNegocio(editing._id, {
            nombre: form.nombre,
            email: form.email,
            tiendas_administradas: form.tiendas_administradas,
          });
        } else {
          await adminService.crearAdminNegocio({
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            tiendas_administradas: form.tiendas_administradas,
          });
        }
        setShowForm(false);
        resetForm();
        await fetchAdmins();
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al guardar administrador");
      }
    } else {
      if (!form.nombre || !form.email || !form.tienda_id) {
        setError("Nombre, email y sucursal son requeridos");
        return;
      }
      if (!editing && !form.password) {
        setError("La contraseña es requerida");
        return;
      }
      if (!editing && form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      try {
        if (editing) {
          await adminService.actualizarModerador(editing._id, {
            nombre: form.nombre,
            email: form.email,
            tienda_id: form.tienda_id,
          });
        } else {
          await adminService.crearModerador({
            nombre: form.nombre,
            email: form.email,
            password: form.password,
            tienda_id: form.tienda_id,
          });
        }
        setShowForm(false);
        resetForm();
        await fetchModeradores();
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al guardar moderador");
      }
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("¿Eliminar este administrador de negocio?")) return;
    try {
      await adminService.eliminarAdminNegocio(id);
      await fetchAdmins();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  };

  const handleDeleteModerador = async (id: string) => {
    if (!confirm("¿Eliminar este moderador de tienda?")) return;
    try {
      await adminService.eliminarModerador(id);
      await fetchModeradores();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  const items = tab === "admins" ? admins : moderadores;
  const count = items.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Administración</p>
          <h1 className="font-['Lora'] text-2xl font-semibold text-foreground mt-1">Usuarios del sistema</h1>
          <p className="text-sm text-muted-foreground mt-1">{count} {tab === "admins" ? "administradores" : "moderadores"} registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          {tab === "admins" ? "Nuevo admin" : "Nuevo moderador"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-secondary p-1">
        {isGeneral && (
          <button
            onClick={() => setTab("admins")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              tab === "admins"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield size={16} />
            Admins de Negocio
          </button>
        )}
        <button
          onClick={() => setTab("moderadores")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            tab === "moderadores"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCog size={16} />
          Moderadores de Tienda
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-3xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-['Lora'] text-lg font-semibold text-foreground mb-4">
              {editing ? "Editar" : "Nuevo"} {tab === "admins" ? "administrador" : "moderador"}
            </h3>

            {error && (
              <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive mb-4">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Contraseña {editing && <span className="text-muted-foreground normal-case tracking-normal">(dejar vacío para no cambiar)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sucursales — admin negocio: checkboxes / moderador: select */}
              {tab === "admins" ? (
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Sucursales asignadas</label>
                  {storesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      Cargando sucursales...
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto rounded-2xl border border-border p-3">
                      {stores.map((s) => (
                        <label key={s._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-background cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.tiendas_administradas.includes(s._id)}
                            onChange={() => toggleTienda(s._id)}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                          />
                          <div>
                            <span className="text-sm text-foreground">{s.nombre_tienda}</span>
                            <span className="text-xs text-muted-foreground ml-2">{s.ciudad}</span>
                          </div>
                        </label>
                      ))}
                      {stores.length === 0 && <p className="text-sm text-muted-foreground py-2">No hay sucursales disponibles</p>}
                    </div>
                  )}
                  {!storesLoading && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{form.tiendas_administradas.length} sucursal(es) seleccionada(s)</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Sucursal</label>
                  {storesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      Cargando sucursales...
                    </div>
                  ) : (
                    <select
                      value={form.tienda_id}
                      onChange={(e) => setForm({ ...form, tienda_id: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    >
                      <option value="">Seleccionar sucursal</option>
                      {stores.map((s) => (
                        <option key={s._id} value={s._id}>{s.nombre_tienda} — {s.ciudad}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-secondary transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {editing ? "Guardar cambios" : tab === "admins" ? "Crear administrador" : "Crear moderador"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tab === "admins"
          ? admins.map((item) => (
              <div key={item._id} className="bg-card rounded-3xl border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent/10 text-accent">
                    <Shield size={20} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditAdmin(item)} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteAdmin(item._id)} className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{item.nombre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.email}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tiendas_administradas.map((t) => (
                    <span key={t._id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      <MapPin size={10} />
                      {t.nombre_tienda}
                    </span>
                  ))}
                </div>
              </div>
            ))
          : moderadores.map((item) => (
              <div key={item._id} className="bg-card rounded-3xl border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
                    <UserCog size={20} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEditModerador(item)} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-all">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteModerador(item._id)} className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{item.nombre}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.email}</p>
                {item.tienda_moderada && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      <MapPin size={10} />
                      {item.tienda_moderada.nombre_tienda}
                    </span>
                  </div>
                )}
              </div>
            ))}

        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            {tab === "admins" ? "No hay administradores de negocio" : "No hay moderadores de tienda"}
          </div>
        )}
      </div>
    </div>
  );
}
