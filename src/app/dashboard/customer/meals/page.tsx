"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, UserCircle2, Utensils, Activity, Settings } from "lucide-react";

const customerNavItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: <LayoutDashboard size={18} /> },
  { title: "Profile", href: "/dashboard/customer/profile", icon: <UserCircle2 size={18} /> },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag size={18} /> },
  { title: "Activity", href: "/dashboard/customer/activity", icon: <Activity size={18} /> },
  { title: "Settings", href: "/dashboard/customer/settings", icon: <Settings size={18} /> },
  { title: "Meals", href: "/dashboard/customer/meals", icon: <Utensils size={18} /> },
];
import Link from "next/link";
import { mealService } from "@/services/mealService";
import { useEffect, useState } from "react";
import { Meal } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function CustomerDashboardMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await mealService.getMeals({ page: 1, limit: 6 });
        setMeals(res?.data || []);
      } catch {
        setMeals([]);
      }
    };
    fetchMeals();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <ManagementPage title="Meals" description="Browse available meals from your dashboard." items={customerNavItems}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <Card key={meal.id} className="p-4 border shadow-sm">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{meal.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{meal.description || "Freshly prepared meal."}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-600">{formatCurrency(meal.price)}</span>
                <Link href={`/meals/${meal.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
