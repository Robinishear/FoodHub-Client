"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, UserCircle2, Mail, ShieldCheck, Utensils, Activity, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const customerNavItems = [
  { title: "Dashboard", href: "/dashboard/customer", icon: <LayoutDashboard size={18} /> },
  { title: "Profile", href: "/dashboard/customer/profile", icon: <UserCircle2 size={18} /> },
  { title: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag size={18} /> },
  { title: "Activity", href: "/dashboard/customer/activity", icon: <Activity size={18} /> },
  { title: "Settings", href: "/dashboard/customer/settings", icon: <Settings size={18} /> },
  { title: "Meals", href: "/dashboard/customer/meals", icon: <Utensils size={18} /> },
];

export default function CustomerDashboardProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <ManagementPage title="Identity Management" description="Review and update your digital footprint." items={customerNavItems}>
        <div className="space-y-8 pb-12">
          {/* Main Identity Card */}
          <Card className="p-8 md:p-12 border-none shadow-2xl shadow-gray-200/50 rounded-[3rem] bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="h-40 w-40 bg-gray-950 rounded-[3rem] flex items-center justify-center text-6xl font-black text-white shadow-2xl ring-8 ring-gray-50">
                   {user?.name?.charAt(0)}
                </div>
                <div className="grow text-center md:text-left space-y-4">
                   <div>
                      <h2 className="text-4xl font-black text-gray-950 tracking-tighter">{user?.name}</h2>
                      <p className="text-sm font-medium text-gray-400 mt-1">{user?.email}</p>
                   </div>
                   <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="px-4 py-2 bg-orange-50 rounded-xl text-[10px] font-black uppercase text-orange-600 tracking-widest border border-orange-100/50">
                         Access Tier: {user?.role}
                      </div>
                      <div className="px-4 py-2 bg-green-50 rounded-xl text-[10px] font-black uppercase text-green-600 tracking-widest border border-green-100/50">
                         Account Active
                      </div>
                   </div>
                </div>
             </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card className="p-8 border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white space-y-6">
                <h3 className="text-xl font-black text-gray-950 tracking-tight">Security Anchor</h3>
                <div className="space-y-4 text-sm font-medium text-gray-500">
                   <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                      <span>Two-Factor Auth</span>
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Recommended</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                      <span>Login Session</span>
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Secure</span>
                   </div>
                </div>
             </Card>

             <Card className="p-8 border-none shadow-xl shadow-gray-200/40 rounded-[2.5rem] bg-white space-y-6">
                <h3 className="text-xl font-black text-gray-950 tracking-tight">Logistics Beacon</h3>
                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No physical address nodes linked</p>
                   </div>
                   <Button variant="outline" className="w-full h-12 rounded-xl border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                      Deploy New Node
                   </Button>
                </div>
             </Card>
          </div>
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
