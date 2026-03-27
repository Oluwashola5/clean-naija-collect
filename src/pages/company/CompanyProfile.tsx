import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EditCompanyProfileDialog } from "@/components/EditCompanyProfileDialog";

export default function CompanyProfile() {
  const { user } = useAuth();
  const { companies, refresh } = useData();
  const company = companies.find((c) => c.user_id === user?.id) || null;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Company Profile</h1>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>
        {company ? (
          <Card>
            <CardHeader><CardTitle className="text-sm">Company Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Company Name</Label><Input value={company.name} disabled /></div>
              <div className="space-y-2"><Label>Registration Number</Label><Input value={company.registration_number} disabled /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={company.email} disabled /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={company.phone} disabled /></div>
              <div className="space-y-2"><Label>Address</Label><Input value={company.address} disabled /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div><StatusBadge status={company.status} type="approval" /></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground text-center py-8">No company profile found.</p>
        )}

        <EditCompanyProfileDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          company={company}
          onSaved={refresh}
        />
      </div>
    </AppLayout>
  );
}
