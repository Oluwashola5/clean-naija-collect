import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type PickupRow = Database["public"]["Tables"]["pickup_requests"]["Row"];
type IssueRow = Database["public"]["Tables"]["issue_reports"]["Row"];
type CompanyRow = Database["public"]["Tables"]["waste_companies"]["Row"];
type ApprovalRow = Database["public"]["Tables"]["approval_requests"]["Row"];
type ServiceAreaRow = Database["public"]["Tables"]["service_areas"]["Row"];

interface DataContextType {
  pickups: PickupRow[];
  issues: IssueRow[];
  companies: CompanyRow[];
  approvals: ApprovalRow[];
  serviceAreas: ServiceAreaRow[];
  loading: boolean;
  refresh: () => Promise<void>;
  addPickup: (p: Database["public"]["Tables"]["pickup_requests"]["Insert"]) => Promise<void>;
  updatePickupStatus: (id: string, status: string, companyId?: string, companyName?: string) => Promise<void>;
  addIssue: (i: Database["public"]["Tables"]["issue_reports"]["Insert"]) => Promise<void>;
  updateIssueStatus: (id: string, status: string, companyId?: string, companyName?: string) => Promise<void>;
  approveCompany: (approvalId: string, companyId: string) => Promise<void>;
  rejectCompany: (approvalId: string, companyId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRow[]>([]);
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRow[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [pickupsRes, issuesRes, companiesRes, serviceAreasRes] = await Promise.all([
      supabase.from("pickup_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("issue_reports").select("*").order("created_at", { ascending: false }),
      supabase.from("waste_companies").select("*").order("created_at", { ascending: false }),
      supabase.from("service_areas").select("*").order("name"),
    ]);

    if (pickupsRes.data) setPickups(pickupsRes.data);
    if (issuesRes.data) setIssues(issuesRes.data);
    if (companiesRes.data) setCompanies(companiesRes.data);
    if (serviceAreasRes.data) setServiceAreas(serviceAreasRes.data);

    if (user.role === "admin") {
      const appRes = await supabase.from("approval_requests").select("*").order("created_at", { ascending: false });
      if (appRes.data) setApprovals(appRes.data);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addPickup = useCallback(async (p: Database["public"]["Tables"]["pickup_requests"]["Insert"]) => {
    await supabase.from("pickup_requests").insert(p);
    await refresh();
  }, [refresh]);

  const updatePickupStatus = useCallback(async (id: string, status: string, companyId?: string, companyName?: string) => {
    const update: any = { status };
    if (companyId) { update.company_id = companyId; update.company_name = companyName; }
    await supabase.from("pickup_requests").update(update).eq("id", id);
    await refresh();
  }, [refresh]);

  const addIssue = useCallback(async (i: Database["public"]["Tables"]["issue_reports"]["Insert"]) => {
    await supabase.from("issue_reports").insert(i);
    await refresh();
  }, [refresh]);

  const updateIssueStatus = useCallback(async (id: string, status: string, companyId?: string, companyName?: string) => {
    const update: any = { status };
    if (companyId) { update.company_id = companyId; update.company_name = companyName; }
    await supabase.from("issue_reports").update(update).eq("id", id);
    await refresh();
  }, [refresh]);

  const approveCompany = useCallback(async (approvalId: string, companyId: string) => {
    await supabase.from("approval_requests").update({ status: "approved" }).eq("id", approvalId);
    await supabase.from("waste_companies").update({ status: "approved" }).eq("id", companyId);
    await refresh();
  }, [refresh]);

  const rejectCompany = useCallback(async (approvalId: string, companyId: string) => {
    await supabase.from("approval_requests").update({ status: "rejected" }).eq("id", approvalId);
    await supabase.from("waste_companies").update({ status: "rejected" }).eq("id", companyId);
    await refresh();
  }, [refresh]);

  return (
    <DataContext.Provider
      value={{ pickups, issues, companies, approvals, serviceAreas, loading, refresh, addPickup, updatePickupStatus, addIssue, updateIssueStatus, approveCompany, rejectCompany }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DataProvider");
  return ctx;
}
