import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Usuario } from '../types/api.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function saveUser(user: Usuario) {
  localStorage.setItem('usuario', JSON.stringify(user));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setUserData = useCallback((userData: Usuario | null) => {
    setUser(userData);
    if (userData) {
      saveUser(userData);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            await authService.refresh();
          } else {
            setIsLoading(false);
            return;
          }
        }
        try {
          const profile = await authService.getProfile();
          setUserData(profile);
        } catch {
          const storedUser = localStorage.getItem('usuario');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            throw new Error('No user data');
          }
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('usuario');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUserData]);

  const login = async (data: any) => {
    const response = await authService.login(data);
    if (response.usuario) {
      setUserData(response.usuario);
    }
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    if (response.usuario) {
      setUserData(response.usuario);
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const isAdmin = user?.rol === 'admin_general' || user?.rol === 'admin_negocio' || user?.rol === 'moderador_tienda';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
