import type { User, WasteCompany, HouseholdProfile, ServiceArea, PickupRequest, IssueReport, Notification, ApprovalRequest } from "@/types";

export const users: User[] = [
  { id: "u1", email: "admin@cleancollect.ng", name: "Adebayo Okafor", role: "admin", createdAt: "2024-01-05" },
  { id: "u2", email: "ops@greenbin.ng", name: "Chioma Eze", role: "company", createdAt: "2024-02-10" },
  { id: "u3", email: "ops@wasteaway.ng", name: "Tunde Balogun", role: "company", createdAt: "2024-03-01" },
  { id: "u4", email: "amina@gmail.com", name: "Amina Yusuf", role: "household", createdAt: "2024-03-15" },
  { id: "u5", email: "emeka@gmail.com", name: "Emeka Nwosu", role: "household", createdAt: "2024-04-01" },
  { id: "u6", email: "ops@ecohaul.ng", name: "Ngozi Adamu", role: "company", createdAt: "2024-06-01" },
];

export const serviceAreas: ServiceArea[] = [
  { id: "sa1", name: "Ikeja", lga: "Ikeja", state: "Lagos" },
  { id: "sa2", name: "Lekki", lga: "Eti-Osa", state: "Lagos" },
  { id: "sa3", name: "Wuse", lga: "Wuse", state: "Abuja FCT" },
  { id: "sa4", name: "Garki", lga: "Garki", state: "Abuja FCT" },
  { id: "sa5", name: "Port Harcourt", lga: "Port Harcourt", state: "Rivers" },
];

export const companies: WasteCompany[] = [
  { id: "c1", userId: "u2", name: "GreenBin Ltd", registrationNumber: "RC-100234", phone: "08012345678", email: "ops@greenbin.ng", address: "12 Allen Ave, Ikeja, Lagos", serviceAreaIds: ["sa1", "sa2"], status: "approved", createdAt: "2024-02-10" },
  { id: "c2", userId: "u3", name: "WasteAway Inc", registrationNumber: "RC-200567", phone: "08098765432", email: "ops@wasteaway.ng", address: "5 Aminu Kano Cr, Wuse, Abuja", serviceAreaIds: ["sa3", "sa4"], status: "approved", createdAt: "2024-03-01" },
  { id: "c3", userId: "u6", name: "EcoHaul Services", registrationNumber: "RC-300891", phone: "08055512345", email: "ops@ecohaul.ng", address: "22 Aba Rd, Port Harcourt", serviceAreaIds: ["sa5"], status: "pending", createdAt: "2024-06-01" },
];

export const households: HouseholdProfile[] = [
  { id: "h1", userId: "u4", address: "45 Opebi Rd, Ikeja, Lagos", lga: "Ikeja", state: "Lagos", phone: "08033344455" },
  { id: "h2", userId: "u5", address: "8 Admiralty Way, Lekki, Lagos", lga: "Eti-Osa", state: "Lagos", phone: "08077788899" },
];

export const pickupRequests: PickupRequest[] = [
  { id: "p1", householdId: "h1", householdName: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", serviceAreaId: "sa1", companyId: "c1", companyName: "GreenBin Ltd", wasteType: "General Waste", description: "Weekly household waste pickup", scheduledDate: "2026-03-25", status: "Assigned", createdAt: "2026-03-20", updatedAt: "2026-03-21" },
  { id: "p2", householdId: "h2", householdName: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", serviceAreaId: "sa2", companyId: "c1", companyName: "GreenBin Ltd", wasteType: "Recyclables", description: "Plastics and paper for recycling", scheduledDate: "2026-03-26", status: "Pending", createdAt: "2026-03-22", updatedAt: "2026-03-22" },
  { id: "p3", householdId: "h1", householdName: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", serviceAreaId: "sa1", companyId: "c1", companyName: "GreenBin Ltd", wasteType: "Organic Waste", description: "Garden and food waste", scheduledDate: "2026-03-18", status: "Completed", createdAt: "2026-03-15", updatedAt: "2026-03-18" },
  { id: "p4", householdId: "h2", householdName: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", serviceAreaId: "sa2", wasteType: "Bulky Items", description: "Old furniture removal", scheduledDate: "2026-03-28", status: "Pending", createdAt: "2026-03-23", updatedAt: "2026-03-23" },
];

export const issueReports: IssueReport[] = [
  { id: "i1", householdId: "h1", householdName: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", serviceAreaId: "sa1", companyId: "c1", companyName: "GreenBin Ltd", title: "Overflowing dumpster on Opebi Road", description: "The communal dumpster near the junction has been overflowing for 3 days", status: "Assigned", createdAt: "2026-03-19", updatedAt: "2026-03-20" },
  { id: "i2", householdId: "h2", householdName: "Emeka Nwosu", address: "8 Admiralty Way, Lekki", serviceAreaId: "sa2", title: "Illegal dumping site", description: "People are dumping waste in the empty lot behind the estate", status: "New", createdAt: "2026-03-22", updatedAt: "2026-03-22" },
  { id: "i3", householdId: "h1", householdName: "Amina Yusuf", address: "45 Opebi Rd, Ikeja", serviceAreaId: "sa1", companyId: "c1", companyName: "GreenBin Ltd", title: "Missed scheduled pickup", description: "Pickup was scheduled for Monday but nobody came", status: "Resolved", createdAt: "2026-03-10", updatedAt: "2026-03-14" },
];

export const notifications: Notification[] = [
  { id: "n1", userId: "u4", title: "Pickup Assigned", message: "Your waste pickup request has been assigned to GreenBin Ltd.", read: false, createdAt: "2026-03-21" },
  { id: "n2", userId: "u4", title: "Issue Update", message: "Your reported issue 'Overflowing dumpster' has been assigned to a company.", read: true, createdAt: "2026-03-20" },
  { id: "n3", userId: "u2", title: "New Pickup Assignment", message: "A new pickup request has been assigned to your company.", read: false, createdAt: "2026-03-21" },
  { id: "n4", userId: "u1", title: "New Company Registration", message: "EcoHaul Services has applied for registration.", read: false, createdAt: "2026-06-01" },
  { id: "n5", userId: "u5", title: "Welcome to CleanCollect", message: "Your account has been created. Request your first pickup!", read: true, createdAt: "2024-04-01" },
];

export const approvalRequests: ApprovalRequest[] = [
  { id: "a1", companyId: "c3", companyName: "EcoHaul Services", status: "pending", createdAt: "2024-06-01" },
  { id: "a2", companyId: "c1", companyName: "GreenBin Ltd", status: "approved", createdAt: "2024-02-12" },
  { id: "a3", companyId: "c2", companyName: "WasteAway Inc", status: "approved", createdAt: "2024-03-05" },
];

// Demo credentials
export const demoCredentials = [
  { role: "Admin", email: "admin@cleancollect.ng", password: "admin123" },
  { role: "Company", email: "ops@greenbin.ng", password: "company123" },
  { role: "Household", email: "amina@gmail.com", password: "household123" },
];
