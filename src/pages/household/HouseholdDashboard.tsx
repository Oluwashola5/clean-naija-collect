import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Truck, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { households } from "@/data/seed";

export default function HouseholdDashboard() {
  const { user } = useAuth();
  const { pickups, issues } = useData();
  const household = households.find((h) => h.userId === user?.id);
  const myPickups = pickups.filter((p) => p.householdId === household?.id);
  const myIssues = issues.filter((i) => i.householdId === household?.id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild size="sm"><Link to="/household/request-pickup"><Plus className="h-4 w-4 mr-1" /> Request Pickup</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/household/report-issue"><AlertTriangle className="h-4 w-4 mr-1" /> Report Issue</Link></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="My Pickups" value={myPickups.length} icon={Truck} />
          <StatsCard title="Pending" value={myPickups.filter((p) => p.status === "Pending").length} icon={Truck} />
          <StatsCard title="My Issues" value={myIssues.length} icon={AlertTriangle} />
          <StatsCard title="Resolved" value={myIssues.filter((i) => i.status === "Resolved").length} icon={CheckCircle} />
        </div>
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Pickups</CardTitle></CardHeader>
          <CardContent>
            {myPickups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pickups yet. <Link to="/household/request-pickup" className="text-primary hover:underline">Request one now</Link></p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {myPickups.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.wasteType}</TableCell>
                      <TableCell>{p.scheduledDate}</TableCell>
                      <TableCell>{p.companyName || "Pending assignment"}</TableCell>
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
