"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { ShoppingBag, Clock, CheckCircle2, Package, Search, ChevronRight, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Past">("All");

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const textMatch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.status.toLowerCase().includes(search.toLowerCase());
      const statusActive =
        order.status !== "DELIVERED" && order.status !== "CANCELLED";
      if (filter === "Active") return textMatch && statusActive;
      if (filter === "Past") return textMatch && !statusActive;
      return textMatch;
    });
  }, [orders, search, filter]);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <ManagementPage 
        title="My Orders" 
        description="Review and manage your culinary adventures." 
      >
        <div className="space-y-10 pb-20">
           {/* Filters */}
           <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  placeholder="Find an order..." 
                  className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-gray-100 focus:border-orange-500 transition-all font-bold outline-none shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                 {(['All', 'Active', 'Past'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border",
                        filter === f 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : "bg-white text-gray-400 border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      {f}
                    </button>
                 ))}
              </div>
           </div>

           {/* Orders List */}
           <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="p-6 rounded-[32px] border-none shadow-xl shadow-gray-200/40 bg-white group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative"
                >
                   <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
                   <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div className="flex items-center gap-5">
                         <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                            <Package size={26} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-xl font-black text-gray-900">#{order.id.slice(-8).toUpperCase()}</h3>
                               <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                 order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                                 order.status === 'PLACED' || order.status === 'PREPARING' || order.status === 'READY' ? 'bg-orange-50 text-orange-600' :
                                 'bg-red-50 text-red-600'
                               }`}>{order.status.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems?.length || 0} Items</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end">
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Paid</p>
                            <p className="text-xl font-black text-gray-950">{formatCurrency(order.totalAmount)}</p>
                         </div>
                         <div className="flex gap-2">
                            <Link href="/track-order">
                               <Button variant="outline" className="h-11 px-5 rounded-xl border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                                  Track Details
                               </Button>
                            </Link>
                            <Button className="h-11 w-11 p-0 rounded-xl bg-gray-950 hover:bg-orange-500 transition-all shadow-xl">
                               <MessageSquare size={16} className="text-white" />
                            </Button>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>

           {/* Empty State Mock */}
           {filteredOrders.length === 0 && (
             <div className="py-40 text-center space-y-8 bg-white rounded-[64px] border border-dashed border-gray-200">
                <div className="h-24 w-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto text-gray-200">
                   <ShoppingBag size={48} />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-gray-900 mb-2">No Culinary Requests Yet</h4>
                   <p className="text-gray-400 font-bold">Your stomach is waiting. Let&apos;s find something delicious.</p>
                </div>
                <Link href="/meals">
                   <Button className="h-16 px-12 rounded-3xl bg-orange-500 font-black text-lg shadow-2xl shadow-orange-500/20">Start Exploring</Button>
                </Link>
             </div>
           )}
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
