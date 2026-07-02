import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '@/src/lib/api';
import {
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '@/src/lib/storage';
import type { AuthResponse, User } from '@/src/types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>;
  register: (payload: { name: string; email: string; password: string }) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistAuth(payload: AuthResponse) {
  setStoredToken(payload.token);
  setStoredUser(payload.user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStoredToken();
    clearStoredUser();
  };

  const refreshUser = async () => {
    const response = await api.me();
    setUser(response.user);
    setStoredUser(response.user);
  };

  const applyAuth = (payload: AuthResponse) => {
    setUser(payload.user);
    setToken(payload.token);
    persistAuth(payload);
  };

  const login = async (payload: { email: string; password: string }) => {
    const response = await api.login(payload);
    applyAuth(response);
    return response;
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    const response = await api.register(payload);
    applyAuth(response);
    return response;
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      login,
      register,
      logout,
      refreshUser,
    }),
    [isBootstrapping, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
