import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types/user";
import api from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token")
});

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }
    try{
      return JSON.parse(storedUser);
    }catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  const login = (newToken: string, newUser?: User) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
      setAuthLoading(false);
      return;
    }
    try {
      const response = await api.get("/auth/me");
      const currentUser = response.data.user;
      setUser(currentUser);

      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error: any) {
      if(error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      }
    } finally {
      setAuthLoading(false);
    }
    };
    verifyAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}