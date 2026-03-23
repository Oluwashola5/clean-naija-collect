import React, { createContext, useContext, useState, useCallback } from "react";
import type { PickupRequest, IssueReport, WasteCompany, ApprovalRequest } from "@/types";
import {
  pickupRequests as seedPickups,
  issueReports as seedIssues,
  companies as seedCompanies,
  approvalRequests as seedApprovals,
} from "@/data/seed";

interface DataContextType {
  pickups: PickupRequest[];
  issues: IssueReport[];
  companies: WasteCompany[];
  approvals: ApprovalRequest[];
  addPickup: (p: Omit<PickupRequest, "id" | "createdAt" | "updatedAt">) => void;
  updatePickupStatus: (id: string, status: PickupRequest["status"], companyId?: string, companyName?: string) => void;
  addIssue: (i: Omit<IssueReport, "id" | "createdAt" | "updatedAt">) => void;
  updateIssueStatus: (id: string, status: IssueReport["status"], companyId?: string, companyName?: string) => void;
  approveCompany: (approvalId: string) => void;
  rejectCompany: (approvalId: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pickups, setPickups] = useState<PickupRequest[]>(seedPickups);
  const [issues, setIssues] = useState<IssueReport[]>(seedIssues);
  const [companies, setCompanies] = useState<WasteCompany[]>(seedCompanies);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(seedApprovals);

  const today = () => new Date().toISOString().split("T")[0];

  const addPickup = useCallback((p: Omit<PickupRequest, "id" | "createdAt" | "updatedAt">) => {
    setPickups((prev) => [{ ...p, id: `p${Date.now()}`, createdAt: today(), updatedAt: today() }, ...prev]);
  }, []);

  const updatePickupStatus = useCallback((id: string, status: PickupRequest["status"], companyId?: string, companyName?: string) => {
    setPickups((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status, updatedAt: today(), ...(companyId ? { companyId, companyName } : {}) } : p
      )
    );
  }, []);

  const addIssue = useCallback((i: Omit<IssueReport, "id" | "createdAt" | "updatedAt">) => {
    setIssues((prev) => [{ ...i, id: `i${Date.now()}`, createdAt: today(), updatedAt: today() }, ...prev]);
  }, []);

  const updateIssueStatus = useCallback((id: string, status: IssueReport["status"], companyId?: string, companyName?: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status, updatedAt: today(), ...(companyId ? { companyId, companyName } : {}) } : i
      )
    );
  }, []);

  const approveCompany = useCallback((approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: "approved" as const } : a)));
    const approval = approvals.find((a) => a.id === approvalId);
    if (approval) {
      setCompanies((prev) => prev.map((c) => (c.id === approval.companyId ? { ...c, status: "approved" as const } : c)));
    }
  }, [approvals]);

  const rejectCompany = useCallback((approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: "rejected" as const } : a)));
    const approval = approvals.find((a) => a.id === approvalId);
    if (approval) {
      setCompanies((prev) => prev.map((c) => (c.id === approval.companyId ? { ...c, status: "rejected" as const } : c)));
    }
  }, [approvals]);

  return (
    <DataContext.Provider
      value={{ pickups, issues, companies, approvals, addPickup, updatePickupStatus, addIssue, updateIssueStatus, approveCompany, rejectCompany }}
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
