"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card } from "@/components/ui/card";
import { LayoutDashboard, ShoppingBag, UserCircle2, Utensils, Activity, Settings, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";

const customerNavItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: <LayoutDashboard size={18} /> },
  { title: "Profile", href: "/dashboard/customer/profile", icon: <UserCircle2 size={18} /> },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag size={18} /> },
  { title: "Activity", href: "/dashboard/customer/activity", icon: <Activity size={18} /> },
  { title: "Settings", href: "/dashboard/customer/settings", icon: <Settings size={18} /> },
  { title: "Meals", href: "/dashboard/customer/meals", icon: <Utensils size={18} /> },
];

export default function CustomerDashboardActivityPage() {
  const [trend, setTrend] = useState<{ day: string; amount: number }[]>([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await orderService.getMyStats();
        setTrend(stats?.spendingTrend || []);
        setRewardPoints(stats?.rewardPoints || 0);
      } catch {
        setTrend([]);
        setRewardPoints(0);
      }
    };
    loadStats();
  }, []);

  const weeklyTrend = trend.length
    ? trend
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => ({ day, amount: 0 }));
  const maxAmount = Math.max(...weeklyTrend.map((t) => t.amount), 1);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <ManagementPage
        title="Activity"
        description="Your spending and engagement overview."
        items={customerNavItems}
      >
        <div className="space-y-6 pb-6">
          <Card className="border shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Economic Flow</h3>
            <p className="text-xs text-gray-500 mb-5">Your weekly activity trend</p>
            <div className="h-48 flex items-end justify-between gap-2">
              {weeklyTrend.map((point) => {
                const height = Math.max((point.amount / maxAmount) * 100, 5);
                return (
                <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-md h-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-md" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500">{point.day}</span>
                </div>
              )})}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border shadow-sm p-5 bg-gray-950 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <h4 className="font-semibold">Global Favorite</h4>
              </div>
              <p className="text-sm text-gray-300">Italian & Sushi</p>
            </Card>

            <Card className="border shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <h4 className="font-semibold text-gray-900">Rewards</h4>
              </div>
              <p className="text-sm text-gray-600">{rewardPoints.toLocaleString()} HUB points</p>
            </Card>
          </div>
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
