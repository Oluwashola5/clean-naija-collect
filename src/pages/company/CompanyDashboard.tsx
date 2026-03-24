import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { pickups, issues, companies } = useData();
  const company = companies.find((c) => c.user_id === user?.id);
  const myPickups = pickups.filter((p) => p.company_id === company?.id);
  const myIssues = issues.filter((i) => i.company_id === company?.id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground">{company?.name}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Assigned Pickups" value={myPickups.length} icon={Truck} />
          <StatsCard title="Active" value={myPickups.filter((p) => p.status === "In Progress").length} icon={Clock} />
          <StatsCard title="Completed" value={myPickups.filter((p) => p.status === "Completed").length} icon={CheckCircle} />
          <StatsCard title="Issues" value={myIssues.length} icon={AlertTriangle} />
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Assigned Pickups</CardTitle></CardHeader>
          <CardContent>
            {myPickups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pickups assigned yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPickups.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.household_name}</TableCell>
                      <TableCell>{p.waste_type}</TableCell>
                      <TableCell>{p.scheduled_date}</TableCell>
                      <TableCell><StatusBadge status={p.status} type="pickup" /></TableCell>
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
