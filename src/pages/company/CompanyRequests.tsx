import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function CompanyRequests() {
  const { user } = useAuth();
  const { companies } = useData();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const company = companies.find(c => c.user_id === user?.id);

  const fetchRequests = useCallback(async () => {
    if (!company) return;
    const { data } = await supabase
      .from("company_requests")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });
    if (data) setRequests(data);
  }, [company]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("company_requests").update({ status } as any).eq("id", id);
    toast({ title: status === "accepted" ? "Request Accepted" : "Request Rejected" });
    fetchRequests();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Household Requests</h1>
        <Card>
          <CardContent className="pt-6">
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No requests yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.household_name}</TableCell>
                      <TableCell>{r.created_at?.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "accepted" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateStatus(r.id, "accepted")}>Accept</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(r.id, "rejected")}>Reject</Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
