// src/data/roleTypes.ts
export type Role = "owner" | "receptionist" | "accountant";

export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
}

export const pageAccess: Record<string, Role[]> = {
  "/": ["owner", "receptionist", "accountant"],
  "/orders": ["owner", "receptionist"],
  "/customers": ["owner", "receptionist"],
  "/expenses": ["owner", "accountant"],
  "/reports": ["owner", "accountant"],
};
