import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type CompanyRow = Database["public"]["Tables"]["waste_companies"]["Row"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyRow | null;
  onSaved: () => void;
}

export function EditCompanyProfileDialog({ open, onOpenChange, company, onSaved }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setEmail(company.email || "");
      setPhone(company.phone || "");
      setAddress(company.address || "");
      setRegNumber(company.registration_number || "");
    }
  }, [company]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !regNumber.trim()) {
      toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (company) {
        const { error } = await supabase
          .from("waste_companies")
          .update({ name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim(), registration_number: regNumber.trim() })
          .eq("id", company.id);
        if (error) throw error;

        // Also update profile name
        await supabase.from("profiles").update({ name: name.trim() }).eq("user_id", company.user_id);
      }
      toast({ title: "Company profile updated successfully" });
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
          <DialogTitle>Edit Company Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name" />
          </div>
          <div className="space-y-2">
            <Label>Registration Number</Label>
            <Input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="RC Number" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Company address" />
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
