"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { Role } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAllowed = !!user && (!allowedRoles || allowedRoles.includes(user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isAllowed) {
      router.push("/");
    }
  }, [user, loading, router, isAllowed]);

  // If still loading identity, show full loader
  if (loading) {
    return <FullPageLoader message="Authenticating Environment..." transparent />;
  }

  // If not ready (redirecting), show nothing to prevent flickering
  if (!user || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
