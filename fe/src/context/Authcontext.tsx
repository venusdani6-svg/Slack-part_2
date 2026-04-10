"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  fullname: string;
  dispname?: string | null;
  avatar?: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  /** Patch specific fields on the current user — triggers re-render in all consumers */
  updateCurrentUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateCurrentUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
