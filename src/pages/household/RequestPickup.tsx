import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useHouseholdProfile } from "@/hooks/useHouseholdProfile";
import { useToast } from "@/hooks/use-toast";

const wasteTypes = ["General Waste", "Recyclables", "Organic Waste", "Bulky Items", "Hazardous Waste"];

export default function RequestPickup() {
  const { user } = useAuth();
  const { addPickup, serviceAreas } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { household } = useHouseholdProfile();

  const [wasteType, setWasteType] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteType || !description || !date || !household) {
      toast({ title: "Validation Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    await addPickup({
      household_id: household.id,
      household_name: user?.name || "",
      address: household.address,
      service_area_id: serviceAreas[0]?.id || null,
      waste_type: wasteType,
      description,
      scheduled_date: date,
      status: "Pending",
    });
    toast({ title: "Pickup Requested", description: "Your pickup request has been submitted." });
    navigate("/household");
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Request Waste Pickup</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wasteType">Waste Type</Label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger id="wasteType"><SelectValue placeholder="Select waste type" /></SelectTrigger>
                  <SelectContent>{wasteTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Pickup Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the waste..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Pickup Address</Label>
                <Input value={household?.address || "Loading..."} disabled />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
