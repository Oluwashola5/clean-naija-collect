import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditCompanyProfileDialog } from "@/components/EditCompanyProfileDialog";
import type { Database } from "@/integrations/supabase/types";

type CompanyRow = Database["public"]["Tables"]["waste_companies"]["Row"];

export default function AdminCompanies() {
  const { companies, refresh } = useData();
  const [editCompany, setEditCompany] = useState<CompanyRow | null>(null);

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
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.registration_number}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell><StatusBadge status={c.status} type="approval" /></TableCell>
                    <TableCell>{c.created_at?.split("T")[0]}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setEditCompany(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <EditCompanyProfileDialog
        open={!!editCompany}
        onOpenChange={(open) => { if (!open) setEditCompany(null); }}
        company={editCompany}
        onSaved={refresh}
      />
    </AppLayout>
  );
}
