"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleProfilePage } from "@/components/dashboard/RoleProfilePage";

export default function OrganizerProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["ORGANIZER"]}>
      <RoleProfilePage
        title="Organizer Profile"
        description="Maintain your organizer account identity and preferences."
        highlightA="Organizer profile is used for campaign and event ownership."
        highlightB="Keep your profile updated for smooth team collaboration."
        securityLabel="Collaborative"
      />
    </ProtectedRoute>
  );
}
