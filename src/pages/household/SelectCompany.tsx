import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useHouseholdProfile } from "@/hooks/useHouseholdProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Send } from "lucide-react";

export default function SelectCompany() {
  const { companies } = useData();
  const { household } = useHouseholdProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  const approvedCompanies = companies.filter(c => c.status === "approved");

  const fetchRequests = async () => {
    if (!household) return;
    const { data } = await supabase
      .from("company_requests")
      .select("*")
      .eq("household_id", household.id);
    if (data) setRequests(data);
  };

  useEffect(() => { fetchRequests(); }, [household]);

  const sendRequest = async (company: any) => {
    if (!household || !user) return;
    setSending(company.id);
    const { error } = await supabase.from("company_requests").insert({
      household_id: household.id,
      company_id: company.id,
      household_name: user.name,
      company_name: company.name,
      status: "pending",
    } as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request Sent", description: `Your request has been sent to ${company.name}` });
      fetchRequests();
    }
    setSending(null);
  };

  const getRequestStatus = (companyId: string) => {
    const req = requests.find(r => r.company_id === companyId);
    return req?.status || null;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Choose a Waste Company</h1>
        <p className="text-muted-foreground">Select a company to handle your waste management. They will review and accept your request.</p>
        {approvedCompanies.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No approved companies available yet</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedCompanies.map(c => {
              const status = getRequestStatus(c.id);
              return (
                <Card key={c.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{c.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{c.address}</p>
                      <p>{c.phone}</p>
                    </div>
                    {status === "pending" && <Badge variant="secondary">Request Pending</Badge>}
                    {status === "accepted" && <Badge className="bg-green-600 text-white">Accepted</Badge>}
                    {status === "rejected" && <Badge variant="destructive">Rejected</Badge>}
                    {!status && (
                      <Button size="sm" className="w-full" disabled={sending === c.id} onClick={() => sendRequest(c)}>
                        <Send className="h-4 w-4 mr-1" /> {sending === c.id ? "Sending..." : "Send Request"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
