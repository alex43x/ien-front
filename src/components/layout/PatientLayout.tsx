import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { Bell, LogOut, UserRound, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C } from "../../constants/colors";

export default function PatientLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F7F5F4]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-white/80 backdrop-blur-md border-b border-[rgba(62,58,56,0.09)] px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <img src="/src/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />

        <div className="flex items-center gap-3">
          <button className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#7A7270] hover:bg-[#F0EDEC] transition-all">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.red.color }} />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-[#F0EDEC] transition-all"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.yellow.soft }}>
                <UserRound size={14} style={{ color: C.yellow.color }} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#3E3A38] leading-tight">{user?.nombre || "Usuario"}</p>
                <p className="text-[10px] text-[#7A7270] leading-tight">{user?.email || ""}</p>
              </div>
              <ChevronDown size={14} className="text-[#7A7270]" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-[rgba(62,58,56,0.09)] shadow-lg overflow-hidden z-50">
                <div className="p-4 border-b border-[rgba(62,58,56,0.09)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.yellow.soft }}>
                      <UserRound size={18} style={{ color: C.yellow.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#3E3A38] truncate">{user?.nombre}</p>
                      <p className="text-xs text-[#7A7270] truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#7A7270] hover:bg-[#F0EDEC] hover:text-[#3E3A38] transition-all"
                  >
                    <Settings size={15} />
                    Configuración
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#7A7270] hover:bg-[#FAEAEA] hover:text-[#E96B6B] transition-all"
                  >
                    <LogOut size={15} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
