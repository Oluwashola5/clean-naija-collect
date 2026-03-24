import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useData } from "@/contexts/DataContext";
import { Users, Building2, Truck, AlertTriangle, CheckSquare, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(152,55%,28%)", "hsl(205,80%,50%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)", "hsl(152,60%,40%)"];

export default function AdminDashboard() {
  const { pickups, issues, companies, approvals, serviceAreas } = useData();

  const pickupByStatus = ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"].map((s) => ({
    name: s,
    value: pickups.filter((p) => p.status === s).length,
  }));

  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard title="Companies" value={companies.length} icon={Building2} />
          <StatsCard title="Pending Approvals" value={pendingApprovals} icon={CheckSquare} />
          <StatsCard title="Total Pickups" value={pickups.length} icon={Truck} />
          <StatsCard title="Open Issues" value={issues.filter((i) => i.status !== "Resolved" && i.status !== "Closed").length} icon={AlertTriangle} />
          <StatsCard title="Service Areas" value={serviceAreas.length} icon={MapPin} />
          <StatsCard title="Active Companies" value={companies.filter(c => c.status === "approved").length} icon={Users} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Pickups by Status</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pickupByStatus}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(152,55%,28%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Pickup Distribution</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pickupByStatus.filter((d) => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pickupByStatus.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Pickups</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Household</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickups.slice(0, 5).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.household_name}</TableCell>
                    <TableCell>{p.waste_type}</TableCell>
                    <TableCell>{p.company_name || "—"}</TableCell>
                    <TableCell>{p.scheduled_date}</TableCell>
                    <TableCell><StatusBadge status={p.status} type="pickup" /></TableCell>
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
