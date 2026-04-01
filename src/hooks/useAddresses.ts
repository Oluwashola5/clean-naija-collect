import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  lga: string;
  state: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export function useAddresses(userId?: string) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const targetUserId = userId || user?.id;

  const fetchAddresses = useCallback(async () => {
    if (!targetUserId) { setAddresses([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", targetUserId)
      .order("is_default", { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  }, [targetUserId]);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const upsertAddress = async (address: Partial<Address> & { street: string; city: string; lga: string; state: string }) => {
    if (!targetUserId) return;
    if (address.id) {
      const { error } = await supabase.from("addresses").update({
        label: address.label || "home",
        street: address.street,
        city: address.city,
        lga: address.lga,
        state: address.state,
        postal_code: address.postal_code || null,
        is_default: address.is_default ?? false,
      }).eq("id", address.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("addresses").insert({
        user_id: targetUserId,
        label: address.label || "home",
        street: address.street,
        city: address.city,
        lga: address.lga,
        state: address.state,
        postal_code: address.postal_code || null,
        is_default: address.is_default ?? false,
      });
      if (error) throw error;
    }
    await fetchAddresses();
  };

  const deleteAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) throw error;
    await fetchAddresses();
  };

  return { addresses, loading, refetch: fetchAddresses, upsertAddress, deleteAddress };
}
