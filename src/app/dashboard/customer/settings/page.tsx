"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ShoppingBag, UserCircle2, Utensils, Activity, Settings, Bell, MapPin, Shield, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const customerNavItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: <LayoutDashboard size={18} /> },
  { title: "Profile", href: "/dashboard/customer/profile", icon: <UserCircle2 size={18} /> },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag size={18} /> },
  { title: "Activity", href: "/dashboard/customer/activity", icon: <Activity size={18} /> },
  { title: "Settings", href: "/dashboard/customer/settings", icon: <Settings size={18} /> },
  { title: "Meals", href: "/dashboard/customer/meals", icon: <Utensils size={18} /> },
];

const settingItems = [
  { icon: <Bell size={16} />, label: "Transmission Updates", status: "Enabled", color: "text-green-500" },
  { icon: <MapPin size={16} />, label: "Logistics Beacon", status: "Enabled", color: "text-green-500" },
  { icon: <Shield size={16} />, label: "Security Handshake", status: "Critical Only", color: "text-orange-500" },
  { icon: <Lock size={16} />, label: "Secondary Auth", status: "Disabled", color: "text-gray-400" },
];

export default function CustomerDashboardSettingsPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <ManagementPage
        title="Settings"
        description="Control account notifications and security."
        items={customerNavItems}
      >
        <Card className="border shadow-sm p-4 mb-4">
          <div className="text-sm text-gray-800">
            <p className="font-semibold">{user?.name || "Customer"}</p>
            <p className="text-xs text-gray-500">{user?.email || "No email available"}</p>
            <p className="text-[11px] mt-2 uppercase text-orange-600 font-semibold">Role: {user?.role || "CUSTOMER"}</p>
          </div>
        </Card>
        <div className="space-y-4 pb-6">
          {settingItems.map((item) => (
            <Card key={item.label} className="border shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
                  <span className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">{item.icon}</span>
                  {item.label}
                </div>
                <span className={`text-[11px] font-semibold uppercase ${item.color}`}>{item.status}</span>
              </div>
            </Card>
          ))}
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
