import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, ArrowRight, Truck, AlertTriangle, BarChart3, Shield, Users, MapPin, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { demoCredentials } from "@/data/seed";

const features = [
  { icon: Truck, title: "Pickup Scheduling", desc: "Request waste pickups on-demand or schedule recurring collections with real-time status tracking." },
  { icon: AlertTriangle, title: "Issue Reporting", desc: "Report illegal dumping, missed pickups, or overflow bins with photo evidence and GPS location." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Monitor collection rates, response times, and environmental impact across your service areas." },
  { icon: Shield, title: "Verified Companies", desc: "Only admin-approved, licensed waste management companies operate on the platform." },
];

const stats = [
  { value: "50+", label: "Service Areas", icon: MapPin },
  { value: "10K+", label: "Households Served", icon: Users },
  { value: "98%", label: "Pickup Success Rate", icon: CheckCircle2 },
  { value: "4.8★", label: "User Rating", icon: Star },
];

const howItWorks = [
  { step: "01", title: "Create Your Account", desc: "Sign up as a household user or waste management company in under 2 minutes." },
  { step: "02", title: "Choose Your Provider", desc: "Browse verified waste companies in your area, compare services, and send a connection request." },
  { step: "03", title: "Schedule & Track", desc: "Request pickups, report issues, and track everything from your personalized dashboard." },
];

const testimonials = [
  { name: "Amina B.", location: "Ikeja, Lagos", text: "CleanCollect transformed how we handle waste in our estate. Pickups are always on time now!", avatar: "AB" },
  { name: "Chukwudi O.", location: "Wuse, Abuja", text: "As a waste company, managing requests and routes has never been this organized. Highly recommend.", avatar: "CO" },
  { name: "Fatima M.", location: "Kano Municipal", text: "I love being able to report dumping sites with photos. The response time is incredible.", avatar: "FM" },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

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
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
            🇳🇬 Built for Nigeria
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Smarter Waste Management for <span className="text-primary">Cleaner Communities</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect households, waste management companies, and local authorities on one platform. Schedule pickups, report issues, and track everything in real time.
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

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-3xl md:text-4xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">A complete waste management ecosystem designed for Nigerian communities.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 border-y">
        <div className="container py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Get started in three simple steps.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative text-center"
              >
                <span className="text-6xl font-black text-primary/10">{item.step}</span>
                <h3 className="font-semibold text-lg -mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-8 h-5 w-5 text-muted-foreground/40" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Join thousands of satisfied households and companies across Nigeria.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border bg-card p-6"
            >
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">{t.avatar}</div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y bg-primary/5">
        <div className="container py-16 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Clean Up Your Community?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Whether you're a household looking for reliable waste collection or a company ready to scale, CleanCollect is built for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/signup">Create Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Explore Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo credentials */}
      <section className="container py-16">
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