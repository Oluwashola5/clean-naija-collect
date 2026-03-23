import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recycle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "company") {
      navigate("/register-company");
    } else {
      toast({ title: "Demo Mode", description: "In the full app, your account would be created. Use demo credentials to log in.", variant: "default" });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2"><Recycle className="h-10 w-10 text-primary" /></div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join CleanCollect today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role"><SelectValue placeholder="Select account type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="household">Household User</SelectItem>
                  <SelectItem value="company">Waste Management Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">{role === "company" ? "Continue to Registration" : "Create Account"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
