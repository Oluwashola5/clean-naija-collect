import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { households } from "@/data/seed";

export default function HouseholdProfile() {
  const { user } = useAuth();
  const household = households.find((h) => h.userId === user?.id);

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Card>
          <CardHeader><CardTitle className="text-sm">Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Full Name</Label><Input value={user?.name || ""} disabled /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={household?.phone || "N/A"} disabled /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={household?.address || "N/A"} disabled /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>LGA</Label><Input value={household?.lga || "N/A"} disabled /></div>
              <div className="space-y-2"><Label>State</Label><Input value={household?.state || "N/A"} disabled /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
