import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, UserRole, Notification } from "@/types";
import { users as seedUsers, notifications as seedNotifications } from "@/data/seed";

interface AuthContextType {
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("cc_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [notifs, setNotifs] = useState<Notification[]>(seedNotifications);

  useEffect(() => {
    if (user) localStorage.setItem("cc_user", JSON.stringify(user));
    else localStorage.removeItem("cc_user");
  }, [user]);

  const login = useCallback((email: string, _password: string) => {
    const found = seedUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "createdAt" | "read">) => {
      setNotifs((prev) => [
        { ...n, id: `n${Date.now()}`, createdAt: new Date().toISOString().split("T")[0], read: false },
        ...prev,
      ]);
    },
    []
  );

  const userNotifs = notifs.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifs.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider value={{ user, notifications: userNotifs, unreadCount, login, logout, markNotificationRead, addNotification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
