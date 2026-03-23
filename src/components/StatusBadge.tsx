import { cn } from "@/lib/utils";
import type { PickupStatus, IssueStatus, ApprovalStatus } from "@/types";

const pickupColors: Record<PickupStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  Assigned: "bg-info/15 text-info border-info/30",
  "In Progress": "bg-primary/15 text-primary border-primary/30",
  Completed: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

const issueColors: Record<IssueStatus, string> = {
  New: "bg-warning/15 text-warning-foreground border-warning/30",
  "Under Review": "bg-info/15 text-info border-info/30",
  Assigned: "bg-primary/15 text-primary border-primary/30",
  "In Progress": "bg-accent/15 text-accent-foreground border-accent/30",
  Resolved: "bg-success/15 text-success border-success/30",
  Closed: "bg-muted text-muted-foreground border-border",
};

const approvalColors: Record<ApprovalStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status, type }: { status: string; type: "pickup" | "issue" | "approval" }) {
  const colors =
    type === "pickup"
      ? pickupColors[status as PickupStatus]
      : type === "issue"
        ? issueColors[status as IssueStatus]
        : approvalColors[status as ApprovalStatus];

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", colors)}>
      {status}
    </span>
  );
}
