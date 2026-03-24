import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PickupStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

const statuses: PickupStatus[] = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"];

export default function CompanyPickups() {
  const { user } = useAuth();
  const { pickups, companies, updatePickupStatus } = useData();
  const { toast } = useToast();
  const company = companies.find((c) => c.user_id === user?.id);
  const myPickups = pickups.filter((p) => p.company_id === company?.id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Pickups</h1>
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            {myPickups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pickups assigned</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPickups.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.household_name}</TableCell>
                      <TableCell>{p.address}</TableCell>
                      <TableCell>{p.waste_type}</TableCell>
                      <TableCell>{p.scheduled_date}</TableCell>
                      <TableCell><StatusBadge status={p.status} type="pickup" /></TableCell>
                      <TableCell>
                        <Select value={p.status} onValueChange={async (v) => { await updatePickupStatus(p.id, v); toast({ title: "Updated" }); }}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>{statuses.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                        </Select>
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
