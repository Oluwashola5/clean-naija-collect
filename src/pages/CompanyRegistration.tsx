import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", regNumber: "", phone: "", email: "", address: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data: company, error: companyError } = await supabase.from("waste_companies").insert({
        name: form.name,
        registration_number: form.regNumber,
        phone: form.phone,
        email: form.email,
        address: form.address,
        user_id: user.id,
        status: "pending",
      }).select().single();

      if (companyError) throw companyError;

      await supabase.from("approval_requests").insert({
        company_id: company.id,
        company_name: form.name,
        status: "pending",
      });

      toast({ title: "Registration Submitted", description: "Your company registration is pending admin approval." });
      navigate("/company");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Building2 className="h-10 w-10 text-primary" /></div>
          <CardTitle className="text-2xl">Company Registration</CardTitle>
          <CardDescription>Register your waste management company</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., GreenBin Ltd" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration Number (RC)</Label>
              <Input id="regNumber" value={form.regNumber} onChange={e => setForm(f => ({ ...f, regNumber: e.target.value }))} placeholder="e.g., RC-100234" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="080xxxxxxxx" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input id="companyEmail" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ops@company.ng" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Textarea id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full office address" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Approval"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
