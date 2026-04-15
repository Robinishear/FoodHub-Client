"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, ShieldCheck, MapPin, Calendar, LogOut, Settings, Bell, CreditCard, Lock, Edit3, ChevronRight, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FullPageLoader } from "@/components/shared/FullPageLoader";
import { useState } from "react";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const { user, logout, resyncUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return <FullPageLoader transparent />;
  }

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await authService.updateProfile(formData);
      await resyncUser(); // Refresh user state in context
      setIsEditing(false);
      toast.success("Identity updated successfully");
    } catch (error) {
      toast.error("Process failed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: <User size={18} /> },
    { id: "orders", label: "My Orders", icon: <CreditCard size={18} /> },
    { id: "activity", label: "Activity", icon: <Calendar size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 max-w-6xl pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 text-center">
              <div className="relative inline-block mb-4">
                 <div className="h-28 w-28 bg-orange-500 rounded-[2rem] shadow-2xl flex items-center justify-center text-4xl font-black text-white relative">
                    {user.name.charAt(0)}
                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-gray-50 text-gray-400 hover:text-orange-500 transition-all hover:scale-110">
                       <Edit3 size={16} />
                    </button>
                 </div>
              </div>
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">{user.name}</h2>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-2 bg-orange-50 py-1 rounded-full">{user.role}</p>
           </div>

           <nav className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "w-full flex items-center justify-between px-8 py-5 transition-all text-sm font-black border-l-4",
                     activeTab === tab.id 
                       ? "bg-orange-50/50 border-orange-500 text-orange-600" 
                       : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                   )}
                 >
                    <div className="flex items-center gap-4">
                       <span className={cn("transition-colors", activeTab === tab.id ? "text-orange-500" : "text-gray-400")}>{tab.icon}</span>
                       {tab.label}
                    </div>
                    <ChevronRight size={16} className={cn("transition-all duration-300", activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
                 </button>
              ))}
              <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                 <Button 
                   variant="ghost" 
                   onClick={logout}
                   className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl px-4 font-black text-xs uppercase tracking-widest"
                 >
                    <LogOut size={16} className="mr-4" /> Terminate Session
                 </Button>
              </div>
           </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
           <Card className="border-none shadow-2xl shadow-gray-200/60 rounded-[3rem] bg-white min-h-[600px] overflow-hidden">
              <div className="p-8 md:p-12">
                 {activeTab === "profile" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-gray-50">
                          <div>
                             <h2 className="text-3xl font-black text-gray-950 tracking-tight">Personal Identity</h2>
                             <p className="text-sm font-medium text-gray-400">Manage your digital footprints and access.</p>
                          </div>
                          {!isEditing ? (
                             <Button onClick={() => setIsEditing(true)} className="rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-950 hover:bg-orange-500 h-11 px-8 shadow-xl active:scale-95 transition-all">Modify Profile</Button>
                          ) : (
                             <div className="flex gap-2">
                                <Button onClick={() => setIsEditing(false)} variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-11 px-8">Discard</Button>
                                <Button 
                                  onClick={handleUpdate} 
                                  disabled={isUpdating}
                                  className="rounded-2xl font-black text-[10px] uppercase tracking-widest bg-orange-500 hover:bg-orange-600 h-11 px-8 shadow-xl shadow-orange-500/20"
                                >
                                   {isUpdating ? <Loader2 className="animate-spin" size={16} /> : "Finalize Changes"}
                                </Button>
                             </div>
                          )}
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] block ml-1">Legal Name</label>
                                {isEditing ? (
                                   <input 
                                     value={formData.name}
                                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                                     className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 ring-orange-500/5 outline-none transition-all"
                                   />
                                ) : (
                                   <div className="p-5 bg-gray-50 rounded-2xl text-sm font-black text-gray-950 border border-transparent shadow-inner">
                                      {user.name}
                                   </div>
                                )}
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] block ml-1">Email Node</label>
                                {isEditing ? (
                                   <input 
                                     value={formData.email}
                                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                                     className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 ring-orange-500/5 outline-none transition-all"
                                   />
                                ) : (
                                   <div className="p-5 bg-gray-50 rounded-2xl text-sm font-black text-gray-950 flex items-center justify-between border border-transparent shadow-inner">
                                      {user.email}
                                      <ShieldCheck size={18} className="text-green-500" />
                                   </div>
                                )}
                             </div>
                          </div>
                          <div className="space-y-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] block ml-1">Universal ID</label>
                                <div className="p-5 bg-gray-950 rounded-2xl text-[10px] font-black text-orange-500 uppercase tracking-widest shadow-2xl">
                                   {user.id}
                                </div>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] block ml-1">System Status</label>
                                <div className="p-5 bg-green-50 rounded-2xl text-sm font-black text-green-700 flex items-center gap-4">
                                   <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={16} /></div> 
                                   Verified Active Protocol
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="bg-orange-500 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-500/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                          <div className="flex gap-6 items-center relative z-10">
                             <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl"><Calendar size={32} /></div>
                             <div>
                                <p className="text-[10px] font-black text-orange-100 uppercase tracking-[0.3em] mb-1">Genesis Date</p>
                                <p className="text-2xl font-black">March 14, 2026</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "activity" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex justify-between items-end pb-8 border-b border-gray-50">
                          <div>
                             <h2 className="text-3xl font-black text-gray-950 tracking-tight">Economic Flow</h2>
                             <p className="text-sm font-medium text-gray-400">Your traversal and spending footprint.</p>
                          </div>
                          <div className="bg-orange-50 text-orange-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-orange-100">$2.4k Volume</div>
                       </div>
                       
                       <div className="h-72 flex items-end justify-between gap-6 px-4 bg-gray-50/50 rounded-[2.5rem] p-10 border border-gray-100 shadow-inner">
                          {[30, 45, 25, 60, 85, 40, 75].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                               <div className="w-full bg-white rounded-2xl relative overflow-hidden h-full border border-gray-200">
                                  <div className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-2xl transition-all duration-1000 group-hover:bg-orange-600 shadow-xl" style={{ height: `${h}%` }}>
                                     <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10"></div>
                                  </div>
                               </div>
                               <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                            </div>
                          ))}
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 bg-gray-900 rounded-[2rem] border-none text-white space-y-4 shadow-2xl">
                             <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Favorite</p>
                                <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center"><Zap size={14} /></div>
                             </div>
                             <p className="text-2xl font-black">Italian & Sushi</p>
                             <p className="text-[10px] font-bold text-gray-400">Based on 24 historical orders.</p>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Rewards</p>
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Shield size={20} /></div>
                                <p className="text-3xl font-black text-gray-950 tracking-tighter">4,820 <span className="text-sm font-bold text-gray-400">HUB</span></p>
                             </div>
                             <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Elite Tier Status</p>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "settings" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="pb-8 border-b border-gray-50">
                          <h2 className="text-3xl font-black text-gray-950 tracking-tight">System Settings</h2>
                          <p className="text-sm font-medium text-gray-400">Sync protocols and security anchors.</p>
                       </div>
                       <div className="space-y-4">
                         {[
                           { icon: <Bell size={18} />, label: 'Transmission Updates', status: 'Enabled', color: 'text-green-500' },
                           { icon: <MapPin size={18} />, label: 'Logistics Beacon', status: 'Enabled', color: 'text-green-500' },
                           { icon: <Shield size={18} />, label: 'Security Handshake', status: 'Critical Only', color: 'text-orange-500' },
                           { icon: <Lock size={18} />, label: 'Secondary Auth', status: 'Disabled', color: 'text-gray-300' }
                         ].map((s, i) => (
                           <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
                              <div className="flex items-center gap-6">
                                 <div className="h-12 w-12 bg-white rounded-[1.2rem] flex items-center justify-center shadow-lg text-gray-400 group-hover:text-orange-500 group-hover:rotate-6 transition-all">{s.icon}</div>
                                 <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{s.label}</span>
                              </div>
                              <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", s.color)}>{s.status}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                 )}
              </div>
           </Card>
        </main>
      </div>
    </div>
  );
}
