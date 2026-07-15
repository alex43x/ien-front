import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Store,
  Package,
  QrCode,
  UserPlus,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../constants/colors";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Pacientes", path: "/admin/pacientes", icon: Users },
  { label: "Reportes", path: "/admin/reportes", icon: BarChart3 },
  { label: "Sucursales", path: "/admin/sucursales", icon: Store },
  { label: "Productos", path: "/admin/productos", icon: Package },
  { label: "Códigos", path: "/admin/codigos", icon: QrCode },
  { label: "Crear Admin", path: "/admin/crear-admin", icon: UserPlus },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex h-screen overflow-hidden">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[rgba(62,58,56,0.09)] transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 px-6 h-16 border-b border-[rgba(62,58,56,0.09)]">
              <img src="/imports/logo_ien-03.png" alt="IEN" className="h-8 w-auto" />
              <span className="text-sm font-semibold text-[#3E3A38]">Admin</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${active ? "bg-[#E6F5F3] text-[#1E6860]" : "text-[#7A7270] hover:bg-[#F0EDEC] hover:text-[#3E3A38]"}`}
                  >
                    <Icon size={18} className={active ? "text-[#4DAAA0]" : ""} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-[rgba(62,58,56,0.09)]">
              <div className="rounded-xl bg-[#F7F5F4] p-3 mb-3">
                <p className="text-xs font-medium text-[#3E3A38] truncate">{user?.nombre}</p>
                <p className="text-[10px] text-[#7A7270] truncate">{user?.rol === 'admin_general' ? 'Admin General' : 'Admin de Negocio'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#7A7270] hover:bg-[#FAEAEA] hover:text-[#E96B6B] transition-all"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-[rgba(62,58,56,0.09)] px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#7A7270] hover:text-[#3E3A38]">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm font-semibold text-[#3E3A38]">Panel de administración</p>
                <p className="text-xs text-[#7A7270]">Monitorea usuarios, respuestas y evaluaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-[#1E6860]" style={{ backgroundColor: C.green.bg, border: `1px solid ${C.green.border}` }}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4DAAA0]" /> Admin activo
              </div>
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#7A7270] hover:bg-[#F0EDEC] transition-all">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#E96B6B]" />
              </button>
              <button onClick={handleLogout} title="Cerrar sesión" className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-[#7A7270] hover:bg-[#FAEAEA] hover:text-[#E96B6B] transition-all">
                <LogOut size={14} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
