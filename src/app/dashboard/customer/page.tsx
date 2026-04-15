/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { authService } from "@/services/authService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap, CreditCard, Heart, Search, Clock3, Loader2, ShieldCheck, Bell, Lock, MapPin, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { formatCurrency } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function CustomerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <CustomerDashboardContent />
    </ProtectedRoute>
  );
}

function CustomerDashboardContent() {
  const { user, resyncUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isUpdatingIdentity, setIsUpdatingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const firstName = user?.name?.split(" ")[0] || "Customer";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await orderService.getMyStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch customer stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    setIdentityForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user?.name, user?.email]);

  const handleUpdateIdentity = async () => {
    setIsUpdatingIdentity(true);
    try {
      await authService.updateProfile(identityForm);
      await resyncUser();
      setIsEditingIdentity(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingIdentity(false);
    }
  };

  if (loading) {
    return <FullPageLoader transparent />;
  }

  return (
    <ManagementPage
      title={`Welcome, ${firstName}`}
      description="Track your orders, spending, and account activity."
      action={
        <Link href="/meals">
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            Browse Meals <Search size={16} className="ml-2" />
          </Button>
        </Link>
      }
    >
      <div className="space-y-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Spending", value: formatCurrency(stats?.totalSpent || 0), icon: <CreditCard size={20} />, color: "bg-green-50 text-green-600" },
            { label: "Rewards", value: (stats?.rewardPoints || 0).toLocaleString(), icon: <Zap size={20} />, color: "bg-orange-50 text-orange-600" },
            { label: "Saved", value: "0", icon: <Heart size={20} />, color: "bg-red-50 text-red-600" },
            { label: "Active Orders", value: stats?.lastOrders?.filter((o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length || 0, icon: <Clock3 size={20} />, color: "bg-blue-50 text-blue-600" },
          ].map((stat, i) => (
            <Card key={i} className="p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-[11px] text-gray-500">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold text-gray-900">Spending Trend</h2>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {(stats?.spendingTrend || Array.from({ length: 7 }).map((_, i) => ({ day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i], amount: 0 }))).map((item: any, i: number) => {
                const maxAmount = Math.max(...(stats?.spendingTrend?.map((t: any) => t.amount) || [100]));
                const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-md h-full relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-md" style={{ height: `${Math.max(height, 6)}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="border shadow-sm p-5 space-y-3">
            <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
            <Link href="/dashboard/customer/profile" className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm">Account Settings</Link>
            <Link href="/dashboard/customer/orders" className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm">Track Orders</Link>
            <Link href="/dashboard/customer/profile" className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm">Manage Addresses</Link>
          </Card>
        </div>

        <Card className="border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/customer/orders" className="text-xs font-medium text-orange-600">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(stats?.lastOrders || []).map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-xs text-gray-600">#{order.id.slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.orderItems[0]?.meal.title || "Multi Item Order"}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 font-bold uppercase tracking-wider">{order.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Identity Management</h2>
              <p className="text-xs text-gray-500">Profile and security settings from your identity page</p>
            </div>
            {!isEditingIdentity ? (
              <Button size="sm" onClick={() => setIsEditingIdentity(true)} className="bg-gray-900 hover:bg-orange-500">
                Modify Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditingIdentity(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdateIdentity} disabled={isUpdatingIdentity} className="bg-orange-500 hover:bg-orange-600">
                  {isUpdatingIdentity ? <Loader2 size={14} className="animate-spin" /> : "Save"}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[11px] text-gray-500 mb-2">Full Name</p>
              {isEditingIdentity ? (
                <input
                  value={identityForm.name}
                  onChange={(e) => setIdentityForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              ) : (
                <div className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900">{user?.name}</div>
              )}
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-2">Email</p>
              {isEditingIdentity ? (
                <input
                  value={identityForm.email}
                  onChange={(e) => setIdentityForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              ) : (
                <div className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 flex items-center justify-between">
                  {user?.email}
                  <ShieldCheck size={14} className="text-green-500" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
              <Bell size={14} className="text-green-500" /> Updates: Enabled
            </div>
            <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
              <MapPin size={14} className="text-green-500" /> Location: Enabled
            </div>
            <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
              <Shield size={14} className="text-orange-500" /> Security: Critical
            </div>
            <div className="p-3 rounded-md bg-gray-50 border text-xs font-medium text-gray-700 flex items-center gap-2">
              <Lock size={14} className="text-gray-400" /> 2FA: Disabled
            </div>
          </div>
        </Card>
      </div>
    </ManagementPage>
  );
}
