import type { Role } from "./roleTypes";

export interface Invite {
  id: string;
  email: string;
  role: Role;
  status: "pending" | "accepted" | "revoked";
  invitedBy: string;
  invitedByEmail: string;
  createdAt: number;
  expiresAt: number;
  acceptedAt?: number;
}
