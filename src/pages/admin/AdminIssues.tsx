import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies } from "@/data/seed";
import type { IssueStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statuses: IssueStatus[] = ["New", "Under Review", "Assigned", "In Progress", "Resolved", "Closed"];

export default function AdminIssues() {
  const { issues, updateIssueStatus } = useData();
  const { toast } = useToast();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Issues</h1>
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.title}</TableCell>
                    <TableCell>{i.householdName}</TableCell>
                    <TableCell>{i.companyName || "Unassigned"}</TableCell>
                    <TableCell>{i.createdAt}</TableCell>
                    <TableCell><StatusBadge status={i.status} type="issue" /></TableCell>
                    <TableCell>
                      <Select
                        value={i.status}
                        onValueChange={(v) => {
                          const company = companies.find((c) => c.status === "approved");
                          updateIssueStatus(i.id, v as IssueStatus, company?.id, company?.name);
                          toast({ title: "Updated", description: `Issue status changed to ${v}` });
                        }}
                      >
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
