"use client";

import { useState } from "react";
import { Search, MapPin, Clock, Package, CheckCircle2, ChevronRight, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isTracked, setIsTracked] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if(orderId.length > 3) setIsTracked(true);
  };

  const steps = [
    { id: 1, title: 'Order Confirmed', time: '12:30 PM', completed: true, active: false },
    { id: 2, title: 'Preparing Food', time: '12:45 PM', completed: true, active: false },
    { id: 3, title: 'Order Picked Up', time: '01:05 PM', completed: false, active: true },
    { id: 4, title: 'Arriving Soon', time: '01:20 PM', completed: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4">
      <div className="max-w-4xl w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase text-orange-500 tracking-wider">Order Status</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Track your <span className="text-orange-500">Delivery</span></h1>
          <p className="text-gray-500 font-medium">Enter your Order ID to see live progress.</p>
        </div>

        {/* Search Bar */}
        <Card className="p-2 rounded-2xl shadow-lg border-gray-100 bg-white relative z-10">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Input 
                placeholder="Ex: FH-829103" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-12 pl-12 rounded-xl border-none bg-gray-50 focus:bg-white transition-all font-semibold" 
              />
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button className="h-12 px-8 rounded-xl bg-gray-900 hover:bg-orange-500 transition-all font-bold gap-2">
              Track Now <ChevronRight size={18} />
            </Button>
          </form>
        </Card>

        {isTracked ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Steps Progress */}
            <Card className="lg:col-span-2 p-6 rounded-2xl border-gray-100 shadow-md bg-white space-y-8">
               <div>
                  <div className="flex justify-between items-center mb-1">
                     <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Order ID</p>
                     <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-[10px] font-bold uppercase tracking-wider">In Transit</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">#{orderId.toUpperCase()}</h3>
               </div>

               <div className="space-y-6 relative">
                  <div className="absolute left-5 top-6 bottom-6 w-px bg-gray-100"></div>
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-4 relative z-10">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center border-2 border-white shadow-md transition-all ${
                         step.completed ? 'bg-orange-500 text-white' : 
                         step.active ? 'bg-gray-900 text-white shadow-orange-500/20' : 
                         'bg-gray-100 text-gray-400'
                       }`}>
                          {step.completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                       </div>
                       <div>
                          <p className={`font-bold tracking-tight ${step.active ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</p>
                          <p className="text-[10px] font-semibold text-gray-400">{step.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>

            {/* Map & Rider */}
            <div className="lg:col-span-3 space-y-6">
               <Card className="h-80 rounded-2xl border-gray-100 shadow-md overflow-hidden relative group">
                  <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200" className="w-full h-full object-cover opacity-60" alt="Map" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20 h-16 w-16 -ml-8 -mt-8"></div>
                        <div className="h-10 w-10 bg-gray-950 rounded-xl flex items-center justify-center text-white shadow-xl relative z-10">
                           <MapPin size={20} />
                        </div>
                     </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 shadow-lg flex justify-between items-center">
                     <div className="flex gap-3 items-center">
                        <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><Clock size={16} /></div>
                        <div>
                           <p className="text-[10px] font-bold uppercase text-gray-400">Estimated Arrival</p>
                           <p className="font-bold text-gray-900 text-sm">12 - 15 Mins</p>
                        </div>
                     </div>
                     <ShieldCheck size={20} className="text-green-500" />
                  </div>
               </Card>

               <Card className="p-6 rounded-2xl border-gray-100 shadow-md bg-gray-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-white rounded-xl overflow-hidden shadow-lg">
                        <img src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200" className="w-full h-full object-cover" alt="Rider" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Your Rider</p>
                        <p className="text-lg font-bold">Robert Fox</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" className="h-10 w-10 p-0 border-white/10 text-white hover:bg-white hover:text-black"><Phone size={16} /></Button>
                     <Button className="h-10 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 font-bold text-sm"><MessageSquare size={16} className="mr-2" /> Chat</Button>
                  </div>
               </Card>
            </div>
          </div>
        ) : (
          <div className="py-12 border-t border-gray-100">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: <Clock size={20} />, label: 'Fast Delivery' },
                  { icon: <ShieldCheck size={20} />, label: 'Secure Pay' },
                  { icon: <MapPin size={20} />, label: 'Live Tracking' },
                  { icon: <Package size={20} />, label: 'Fresh Quality' },
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                     <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-orange-500 mx-auto">{item.icon}</div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
