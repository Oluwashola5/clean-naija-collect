import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Building2, MapPin, AlertTriangle, CheckSquare, Bell, User, LogOut, Truck, Plus, History, Recycle,
} from "lucide-react";

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Companies", url: "/admin/companies", icon: Building2 },
  { title: "Approvals", url: "/admin/approvals", icon: CheckSquare },
  { title: "Service Areas", url: "/admin/service-areas", icon: MapPin },
  { title: "Pickups", url: "/admin/pickups", icon: Truck },
  { title: "Issues", url: "/admin/issues", icon: AlertTriangle },
];

const companyNav = [
  { title: "Dashboard", url: "/company", icon: LayoutDashboard },
  { title: "Pickups", url: "/company/pickups", icon: Truck },
  { title: "Issues", url: "/company/issues", icon: AlertTriangle },
];

const householdNav = [
  { title: "Dashboard", url: "/household", icon: LayoutDashboard },
  { title: "Request Pickup", url: "/household/request-pickup", icon: Plus },
  { title: "Report Issue", url: "/household/report-issue", icon: AlertTriangle },
  { title: "History", url: "/household/history", icon: History },
  { title: "Notifications", url: "/household/notifications", icon: Bell },
  { title: "Profile", url: "/household/profile", icon: User },
];

function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const navItems = user?.role === "admin" ? adminNav : user?.role === "company" ? companyNav : householdNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <Recycle className="h-6 w-6 text-sidebar-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg text-sidebar-foreground">CleanCollect</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin" || item.url === "/company" || item.url === "/household"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function TopBar() {
  const { user, logout, unreadCount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleBadge = user?.role === "admin" ? "Administrator" : user?.role === "company" ? "Company" : "Household";

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm text-muted-foreground hidden sm:inline">Welcome back</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to={user?.role === "household" ? "/household/notifications" : "#"} className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-muted-foreground">{roleBadge}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Recycle className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to continue</p>
          <Button asChild><Link to="/login">Go to Login</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
