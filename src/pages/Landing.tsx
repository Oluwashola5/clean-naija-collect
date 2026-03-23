import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, ArrowRight, Truck, AlertTriangle, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { demoCredentials } from "@/data/seed";

const features = [
  { icon: Truck, title: "Pickup Scheduling", desc: "Request waste pickups with real-time status tracking" },
  { icon: AlertTriangle, title: "Issue Reporting", desc: "Report waste issues with photo evidence" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Monitor waste management performance" },
  { icon: Shield, title: "Verified Companies", desc: "Admin-approved waste management partners" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Recycle className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">CleanCollect</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/signup">Get Started</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
            🇳🇬 Built for Nigeria
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Smarter Waste Management for <span className="text-primary">Cleaner Communities</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect households, waste management companies, and local authorities on one platform. Schedule pickups, report issues, and track everything.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">Start Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Demo Login</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <f.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo credentials */}
      <section className="container pb-20">
        <div className="rounded-xl border bg-card p-6 md:p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Demo Credentials</h2>
          <div className="grid gap-3">
            {demoCredentials.map((c) => (
              <div key={c.role} className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                <span className="font-medium text-sm">{c.role}</span>
                <span className="text-sm text-muted-foreground font-mono">{c.email} / {c.password}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 CleanCollect. Built with 💚 for Nigeria.
        </div>
      </footer>
    </div>
  );
}
