"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleProfilePage } from "@/components/dashboard/RoleProfilePage";

export default function ProviderProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["PROVIDER"]}>
      <RoleProfilePage
        title="Provider Profile"
        description="Manage your kitchen identity and profile settings."
        highlightA="Kitchen profile is visible to ordering customers."
        highlightB="Keep your name and contact details accurate."
        securityLabel="Strict"
      />
    </ProtectedRoute>
  );
}
