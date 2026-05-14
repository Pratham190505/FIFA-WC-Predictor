import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "../lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) => Promise<void>;
  logout: () => void;
}

interface AppContextType {
  selectedHomeId: string;
  selectedAwayId: string;
  setSelectedHomeId: (teamId: string) => void;
  setSelectedAwayId: (teamId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedHomeId, setSelectedHomeId] = useState("BRA");
  const [selectedAwayId, setSelectedAwayId] = useState("ARG");

  return (
    <AppContext.Provider
      value={{
        selectedHomeId,
        selectedAwayId,
        setSelectedHomeId,
        setSelectedAwayId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // On app load — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      authAPI
        .me()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    setUser(res.data.user);
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) => {
    const res = await authAPI.register(data);
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    setUser(res.data.user);
  };

  const logout = () => {
    authAPI.logout().catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
