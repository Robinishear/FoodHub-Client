"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleProfilePage } from "@/components/dashboard/RoleProfilePage";

export default function ManagerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <RoleProfilePage
        title="Manager Profile"
        description="Update your management identity and account controls."
        highlightA="This profile is tied to operations and supervision access."
        highlightB="Changes reflect immediately across manager dashboards."
        securityLabel="Operational"
      />
    </ProtectedRoute>
  );
}
