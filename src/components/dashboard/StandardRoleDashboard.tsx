"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import { ArrowUpRight, MoreVertical, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

type NavItem = { title: string; href: string; icon: ReactNode };
type StatItem = { title: string; value: string; trend: string; color: string; icon: ReactNode };
type LinkItem = { title: string; href: string; cta: string };

interface StandardRoleDashboardProps {
  roles: Role[];
  title: string;
  description: string;
  statItems: StatItem[];
  quickLinks: LinkItem[];
}

export function StandardRoleDashboard({
  roles,
  title,
  description,
  statItems,
  quickLinks,
}: StandardRoleDashboardProps) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <ManagementPage title={title} description={description}>
        <div className="space-y-12 pb-12">
          {/* Stats Grid - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statItems.map((stat) => (
              <Card key={stat.title} className="p-8 border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white group hover:scale-[1.02] transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-14 w-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
                    {stat.icon && React.isValidElement(stat.icon) 
                      ? React.cloneElement(stat.icon as React.ReactElement, { size: 24 } as any)
                      : stat.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.trend}</span>
                    <div className="h-1 w-12 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-orange-500 w-2/3"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-950 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.title}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-2xl shadow-gray-200/50 p-10 rounded-[3rem] bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-center mb-12">
                <div>
                  <h4 className="text-2xl font-black text-gray-950 tracking-tight">Performance Stream</h4>
                  <p className="text-sm font-medium text-gray-400">Real-time engagement protocol</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl border-gray-100 font-black text-[10px] uppercase tracking-widest h-10 px-6">
                  Full Analytics <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-2">
                {[35, 48, 44, 60, 72, 66, 82].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <div className="w-full bg-gray-50 rounded-2xl relative overflow-hidden h-full border border-gray-100">
                      <div className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-2xl transition-all duration-1000 group-hover:bg-orange-600 shadow-lg" style={{ height: `${h}%` }}>
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none shadow-2xl shadow-gray-200/50 p-10 rounded-[3rem] bg-white">
              <div className="mb-8">
                <h4 className="text-xl font-black text-gray-950 tracking-tight">Quick Access</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Shortcuts & Tools</p>
              </div>
              <div className="space-y-4">
                {quickLinks.map((item) => (
                  <Link key={`${item.href}-${item.title}`} href={item.href} className="block p-5 rounded-[1.5rem] bg-gray-50 hover:bg-orange-500 group transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-gray-700 group-hover:text-white uppercase tracking-tight">{item.title}</span>
                      <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-white/20">
                         <ChevronRight className="h-4 w-4 text-orange-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Activity Feed Container */}
          <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[3rem] bg-gray-950 text-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="p-10 border-b border-white/5 flex flex-row items-center justify-between relative z-10">
              <div>
                <CardTitle className="text-xl font-black tracking-tight">System Logs</CardTitle>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Live Activity Stream</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white hover:bg-white/5 h-12 w-12 rounded-2xl transition-all">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-10 relative z-10">
               <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                  <div className="h-12 w-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20"><LogOut size={24} className="rotate-180" /></div>
                  <div>
                     <p className="text-sm font-black text-white">Awaiting Connection</p>
                     <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Connect to backend analytics for real-time throughput</p>
                  </div>
               </div>
            </div>
          </Card>

        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
