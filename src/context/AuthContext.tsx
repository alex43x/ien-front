import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types/api.types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const storedUser = localStorage.getItem('usuario');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setIsAuthenticated(true);
        } else {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            // Attempt to refresh token
            const response = await authService.refresh();
            if (response.access_token) {
              const storedUser = localStorage.getItem('usuario');
              if (storedUser) {
                setUser(JSON.parse(storedUser));
              }
              setIsAuthenticated(true);
            }
          }
        }
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
  }, []);

  const login = async (data: any) => {
    const response = await authService.login(data);
    if (response.usuario) {
      setUser(response.usuario);
    }
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    if (response.usuario) {
      setUser(response.usuario);
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
      // Let the ProtectedRoute redirect the user automatically
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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
