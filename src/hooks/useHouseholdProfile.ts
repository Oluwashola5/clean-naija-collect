import { useState, useEffect } from "react";
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

export function useHouseholdProfile() {
  const { user } = useAuth();
  const [household, setHousehold] = useState<HouseholdProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setHousehold(null); setLoading(false); return; }
    supabase
      .from("household_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHousehold(data);
        setLoading(false);
      });
  }, [user]);

  return { household, loading };
}
