export type UserRole = "admin" | "company" | "household";

export type PickupStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type IssueStatus = "New" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface WasteCompany {
  id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  phone: string;
  email: string;
  address: string;
  serviceAreaIds: string[];
  status: ApprovalStatus;
  createdAt: string;
}

export interface HouseholdProfile {
  id: string;
  userId: string;
  address: string;
  lga: string;
  state: string;
  phone: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  lga: string;
  state: string;
}

export interface PickupRequest {
  id: string;
  householdId: string;
  householdName: string;
  address: string;
  serviceAreaId: string;
  companyId?: string;
  companyName?: string;
  wasteType: string;
  description: string;
  scheduledDate: string;
  status: PickupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IssueReport {
  id: string;
  householdId: string;
  householdName: string;
  address: string;
  serviceAreaId: string;
  companyId?: string;
  companyName?: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApprovalRequest {
  id: string;
  companyId: string;
  companyName: string;
  status: ApprovalStatus;
  createdAt: string;
}
