"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProfile, login as apiLogin, logout as apiLogout, signup } from "@/lib/api";
import type { LoginInput, SignupInput, User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((profile) => {
      setUser(profile);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (data: LoginInput) => {
    const { user: loggedInUser } = await apiLogin(data);
    setUser(loggedInUser);
  }, []);

  const signupUser = useCallback(async (data: SignupInput) => {
    const { user: newUser } = await signup(data);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup: signupUser,
      logout,
    }),
    [user, loading, login, signupUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
