import { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { LogOut, UserRound, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../ui/ThemeToggle";

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
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <img src="/imports/logo_ien-03.png" alt="IEN" className="h-10 w-auto" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-secondary transition-all"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                <UserRound size={14} className="text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-foreground leading-tight">{user?.nombre || "Usuario"}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{user?.email || ""}</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card rounded-2xl border border-border shadow-lg overflow-hidden z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                      <UserRound size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{user?.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/cuenta"); }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  >
                    <Settings size={15} />
                    Configuración
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
