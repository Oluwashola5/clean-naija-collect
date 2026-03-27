import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface HouseholdProfile {
  id: string;
  user_id: string;
  address: string;
  lga: string;
  state: string;
  phone: string;
}

export function useHouseholdProfile(userId?: string) {
  const { user } = useAuth();
  const [household, setHousehold] = useState<HouseholdProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  const fetchProfile = useCallback(() => {
    if (!targetUserId) { setHousehold(null); setLoading(false); return; }
    setLoading(true);
    supabase
      .from("household_profiles")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle()
      .then(({ data }) => {
        setHousehold(data);
        setLoading(false);
      });
  }, [targetUserId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { household, loading, refetch: fetchProfile };
}
