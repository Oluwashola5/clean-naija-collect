import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminCompanies() {
  const { companies } = useData();
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>RC Number</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.registration_number}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell><StatusBadge status={c.status} type="approval" /></TableCell>
                    <TableCell>{c.created_at?.split("T")[0]}</TableCell>
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
