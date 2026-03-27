import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface HouseholdData {
  id: string;
  user_id: string;
  address: string;
  lga: string;
  state: string;
  phone: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  household: HouseholdData | null;
  userName?: string;
  onSaved: () => void;
  /** When true, also allow editing the profile name */
  showNameField?: boolean;
}

export function EditHouseholdProfileDialog({ open, onOpenChange, household, userName, onSaved, showNameField }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (household) {
      setPhone(household.phone || "");
      setAddress(household.address || "");
      setLga(household.lga || "");
      setState(household.state || "");
    }
    setName(userName || "");
  }, [household, userName]);

  const handleSave = async () => {
    if (!address.trim() || !lga.trim() || !state.trim() || !phone.trim()) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (household) {
        const { error } = await supabase
          .from("household_profiles")
          .update({ phone, address, lga, state })
          .eq("id", household.id);
        if (error) throw error;
      }

      if (showNameField && name.trim() && household) {
        await supabase.from("profiles").update({ name: name.trim() }).eq("user_id", household.user_id);
      }

      toast({ title: "Profile updated successfully" });
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Household Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {showNameField && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
          )}
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LGA</Label>
              <Input value={lga} onChange={(e) => setLga(e.target.value)} placeholder="LGA" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
