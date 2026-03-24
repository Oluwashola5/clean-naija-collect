import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  supabaseId: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: AppUser | null;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function buildAppUser(sbUser: SupabaseUser): Promise<AppUser | null> {
  const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", sbUser.id).maybeSingle();
  const { data: profileData } = await supabase.from("profiles").select("name").eq("user_id", sbUser.id).maybeSingle();

  if (!roleData) return null;

  return {
    id: sbUser.id,
    email: sbUser.email || "",
    name: profileData?.name || sbUser.email || "",
    role: roleData.role as UserRole,
    supabaseId: sbUser.id,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) {
      setNotifications(data.map((n) => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.created_at,
      })));
    }
  }, [user]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(async () => {
          const appUser = await buildAppUser(session.user);
          setUser(appUser);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setNotifications([]);
        setLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role });
      if (role === "household") {
        // They'll fill in profile details later
      }
    }
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNotifications([]);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{ user, notifications, unreadCount, loading, login, signup, logout, markNotificationRead, refreshNotifications: fetchNotifications }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
