"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Menu as MenuIcon, X, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export function DashboardLayout({ children, items }: { children: React.ReactNode; items: SidebarProps["items"] }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const profileHref = pathname.startsWith("/dashboard/customer")
    ? "/dashboard/customer/profile"
    : pathname.startsWith("/admin")
        ? "/admin/profile"
      : pathname.startsWith("/provider")
        ? "/provider/profile"
      : pathname.startsWith("/dashboard/manager")
        ? "/dashboard/manager/profile"
        : pathname.startsWith("/dashboard/organizer")
          ? "/dashboard/organizer/profile"
          : "/dashboard/customer/profile";
  const hasProfileInMainNav = items.some((item) => {
    const title = item.title.toLowerCase();
    return item.href === profileHref || title.includes("profile") || title.includes("identity");
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/30 relative pt-24 pb-12">
      {/* Mobile Sidebar Toggle - Optimized for better accessibility */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
         <button
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="h-14 w-14 bg-orange-600 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-95 transition-all ring-4 ring-orange-500/20"
         >
           {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
         </button>
      </div>

      {/* Sidebar Overlay for Mobile - Better blur and opacity */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/20 z-40 lg:hidden backdrop-blur-[2px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component - Enhanced with better glassmorphism and depth */}
      <aside className={cn(
        "w-72 bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col fixed lg:sticky transition-all duration-500 ease-in-out",
        "h-[calc(100vh-120px)] top-[100px] mb-8 lg:ml-4 rounded-[2rem] shadow-2xl shadow-gray-200/50",
        "z-40 lg:z-10",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 grow space-y-8 overflow-y-auto custom-scrollbar">
          {/* User Profile Mini Block - More Premium Feel */}
          <div className="p-4 bg-gray-950 rounded-2xl flex items-center gap-4 border border-gray-800 shadow-2xl">
             <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-orange-500/20 ring-2 ring-white/10">
                {user?.name?.charAt(0)}
             </div>
             <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate">{user?.name}</p>
                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mt-0.5">{user?.role}</p>
             </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-2">Console</p>
            <nav className="space-y-1.5">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={`${item.href}-${item.title}`}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 rounded-xl transition-all group font-black text-[11px] uppercase tracking-wider",
                      isActive
                        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20"
                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-950"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn("transition-colors", isActive ? "text-white" : "text-gray-300 group-hover:text-orange-500")}>
                        {React.isValidElement(item.icon)
                          ? React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, {
                              size: 18,
                            })
                          : item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {isActive && <div className="h-1.5 w-1.5 bg-white rounded-full shadow-glow"></div>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 ml-2">Identity</p>
            <nav className="space-y-1.5">
              {!hasProfileInMainNav && (
                <Link href={profileHref} className="flex items-center space-x-3 px-5 py-3.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-950 transition-all font-black text-[11px] uppercase tracking-wider group">
                  <UserIcon size={18} className="text-gray-300 group-hover:text-orange-500" />
                  <span>My Profile</span>
                </Link>
              )}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-[11px] uppercase tracking-wider group"
              >
                <LogOut size={18} />
                <span>Exit Protocol</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Support Section - Simplified and cleaner */}
        <div className="p-4 border-t border-gray-50">
           <Link href="/faq" className="block p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all group">
              <p className="text-[10px] font-black text-gray-400 group-hover:text-orange-600 uppercase tracking-widest">Support Portal</p>
           </Link>
        </div>
      </aside>

      {/* Main Content Viewport - More breathing room and better background */}
      <main className="grow px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  );
}
