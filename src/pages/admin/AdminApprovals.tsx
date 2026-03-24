import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminApprovals() {
  const { approvals, approveCompany, rejectCompany } = useData();
  const { toast } = useToast();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Approvals</h1>
        <Card>
          <CardContent className="pt-6">
            {approvals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No approval requests</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.company_name}</TableCell>
                      <TableCell>{a.created_at?.split("T")[0]}</TableCell>
                      <TableCell><StatusBadge status={a.status} type="approval" /></TableCell>
                      <TableCell>
                        {a.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={async () => { await approveCompany(a.id, a.company_id); toast({ title: "Approved", description: `${a.company_name} approved.` }); }}>
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={async () => { await rejectCompany(a.id, a.company_id); toast({ title: "Rejected", description: `${a.company_name} rejected.` }); }}>
                              Reject
                            </Button>
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
