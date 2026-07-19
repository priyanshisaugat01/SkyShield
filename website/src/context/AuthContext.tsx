import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "skyshield_demo_session";
const DEMO_USER: User = { name: "Alex Rivera", email: "alex@skyshield.io", role: "Security Engineer" };

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage synchronously during the first
  // render, so protected routes never see a false "unauthenticated" flash
  // on a hard reload while an effect-driven read would still be pending.
  const [user, setUser] = useState<User | null>(readStoredUser);

  function login(email: string) {
    const sessionUser: User = email ? { ...DEMO_USER, email } : DEMO_USER;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
