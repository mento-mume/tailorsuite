// src/components/ProtectedRoute.tsx
import { signOut } from "firebase/auth";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/firebase";
import { pageAccess } from "../../data/roleTypes";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // No profile doc (deleted, never provisioned, etc.) is treated the same as
  // a disabled account: there's no role to check against, so deny by default
  // instead of falling through to the role check below.
  if (!profile || profile.status === "disabled") {
    signOut(auth);
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = pageAccess[location.pathname];

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
