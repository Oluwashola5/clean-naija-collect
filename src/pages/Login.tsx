import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle } from "lucide-react";
import { demoCredentials } from "@/data/seed";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return;
    }
    const success = login(email, password);
    if (success) {
      const user = demoCredentials.find((c) => c.email === email);
      const role = user?.role.toLowerCase();
      navigate(role === "admin" ? "/admin" : role === "company" ? "/company" : "/household");
    } else {
      toast({ title: "Login Failed", description: "Invalid credentials. Use demo credentials below.", variant: "destructive" });
    }
  };

  const quickLogin = (email: string) => {
    const success = login(email, "");
    if (success) {
      const user = demoCredentials.find((c) => c.email === email);
      const role = user?.role.toLowerCase();
      navigate(role === "admin" ? "/admin" : role === "company" ? "/company" : "/household");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Recycle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to CleanCollect</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-xs text-center text-muted-foreground font-medium">Quick Demo Login</p>
            <div className="grid gap-2">
              {demoCredentials.map((c) => (
                <Button key={c.role} variant="outline" size="sm" className="w-full justify-between" onClick={() => quickLogin(c.email)}>
                  <span>{c.role}</span>
                  <span className="text-xs text-muted-foreground font-mono">{c.email}</span>
                </Button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
