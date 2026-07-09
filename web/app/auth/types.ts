export type UserRole = "Candidate" | "Recruiter" | "Administrator";

export interface RouteHandle {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}