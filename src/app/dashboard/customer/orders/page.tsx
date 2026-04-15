"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, UserCircle2, Utensils, Activity, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

const customerNavItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: <LayoutDashboard size={18} /> },
  { title: "Profile", href: "/dashboard/customer/profile", icon: <UserCircle2 size={18} /> },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag size={18} /> },
  { title: "Activity", href: "/dashboard/customer/activity", icon: <Activity size={18} /> },
  { title: "Settings", href: "/dashboard/customer/settings", icon: <Settings size={18} /> },
  { title: "Meals", href: "/dashboard/customer/meals", icon: <Utensils size={18} /> },
];

export default function CustomerDashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch {
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <ManagementPage title="My Orders" description="All recent and past customer orders." items={customerNavItems}>
        <Card className="border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 text-xs text-gray-600">#{order.id.slice(-8)}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-600 font-bold uppercase tracking-wider">{order.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
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
      </ManagementPage>
    </ProtectedRoute>
  );
}
