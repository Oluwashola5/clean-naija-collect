import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Registration Submitted", description: "Your company registration is pending admin approval. You'll be notified once approved." });
    navigate("/login");
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
              <Input id="companyName" placeholder="e.g., GreenBin Ltd" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regNumber">Registration Number (RC)</Label>
              <Input id="regNumber" placeholder="e.g., RC-100234" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="080xxxxxxxx" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input id="companyEmail" type="email" placeholder="ops@company.ng" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Textarea id="address" placeholder="Full office address" required />
            </div>
            <Button type="submit" className="w-full">Submit for Approval</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
