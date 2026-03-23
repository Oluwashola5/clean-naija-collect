import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompanyRegistration from "./pages/CompanyRegistration";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminServiceAreas from "./pages/admin/AdminServiceAreas";
import AdminPickups from "./pages/admin/AdminPickups";
import AdminIssues from "./pages/admin/AdminIssues";

import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyPickups from "./pages/company/CompanyPickups";
import CompanyIssues from "./pages/company/CompanyIssues";

import HouseholdDashboard from "./pages/household/HouseholdDashboard";
import RequestPickup from "./pages/household/RequestPickup";
import ReportIssue from "./pages/household/ReportIssue";
import HouseholdHistory from "./pages/household/HouseholdHistory";
import HouseholdNotifications from "./pages/household/HouseholdNotifications";
import HouseholdProfile from "./pages/household/HouseholdProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/register-company" element={<CompanyRegistration />} />

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
              <Route path="/admin/service-areas" element={<AdminServiceAreas />} />
              <Route path="/admin/pickups" element={<AdminPickups />} />
              <Route path="/admin/issues" element={<AdminIssues />} />

              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/pickups" element={<CompanyPickups />} />
              <Route path="/company/issues" element={<CompanyIssues />} />

              <Route path="/household" element={<HouseholdDashboard />} />
              <Route path="/household/request-pickup" element={<RequestPickup />} />
              <Route path="/household/report-issue" element={<ReportIssue />} />
              <Route path="/household/history" element={<HouseholdHistory />} />
              <Route path="/household/notifications" element={<HouseholdNotifications />} />
              <Route path="/household/profile" element={<HouseholdProfile />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
