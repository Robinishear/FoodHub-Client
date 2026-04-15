"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { ShieldCheck, Users, ShoppingBag, Grid3X3, Bell, Lock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminProfilePage() {
  const { user, resyncUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user?.name, user?.email]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authService.updateProfile(formData);
      await resyncUser();
      setIsEditing(false);
      toast.success("Admin profile updated");
    } catch {
      toast.error("Failed to update admin profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <ManagementPage
        title="Admin Profile"
        description="Your administrator identity and access scope."
      >
        <div className="space-y-6 pb-8">
          <Card className="p-6 border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gray-950 text-white flex items-center justify-center text-xl font-black">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 mt-1">
                  {user?.role || "ADMIN"}
                </p>
              </div>
              <div className="ml-auto">
                {!isEditing ? (
                  <Button size="sm" onClick={() => setIsEditing(true)} className="bg-gray-950 hover:bg-orange-500">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 border shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 mb-2">Name</p>
                {isEditing ? (
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">{user?.name}</div>
                )}
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-2">Email</p>
                {isEditing ? (
                  <input
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">{user?.email}</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 border shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Admin Activity Snapshot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-gray-50 border text-sm font-medium text-gray-700">
                Managed modules: Users, Orders, Reviews
              </div>
              <div className="p-4 rounded-md bg-gray-50 border text-sm font-medium text-gray-700">
                Access scope: Full platform control
              </div>
              <div className="p-4 rounded-md bg-gray-50 border text-sm font-medium text-gray-700">
                Session mode: Administrator
              </div>
            </div>
          </Card>

          <Card className="p-6 border shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
                <Bell size={14} className="text-green-500" /> Alerts: Enabled
              </div>
              <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
                <Lock size={14} className="text-orange-500" /> Security Mode: Strict
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <Users size={18} className="text-orange-500" />
                <span className="text-sm font-medium">User Management Access</span>
              </div>
            </Card>
            <Card className="p-4 border shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <ShoppingBag size={18} className="text-orange-500" />
                <span className="text-sm font-medium">Order Oversight Access</span>
              </div>
            </Card>
            <Card className="p-4 border shadow-sm">
              <div className="flex items-center gap-3 text-gray-800">
                <Grid3X3 size={18} className="text-orange-500" />
                <span className="text-sm font-medium">Category Control Access</span>
              </div>
            </Card>
          </div>

          <Card className="p-4 border shadow-sm bg-green-50">
            <div className="flex items-center gap-3 text-green-700">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Administrator session verified</span>
            </div>
          </Card>
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
