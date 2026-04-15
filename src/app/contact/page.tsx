"use client";

import { Mail, MapPin, Phone, MessageSquare, Clock, Globe, ChevronRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
           <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1 rounded-full text-orange-600 font-bold text-[10px] uppercase tracking-widest border border-orange-100">
                 <Globe size={14} /> Get in Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
                How can we <br /> <span className="text-orange-500">Help</span> you today?
              </h1>
              <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-md">
                Have a question about an order, restaurant, or partnership? Our team is available 24/7 to solve your queries.
              </p>
              
              <div className="space-y-4 pt-4 border-l-2 border-orange-500/10 pl-8">
                 <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-orange-500"><Phone size={18} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">Call Center</p>
                       <p className="font-bold text-gray-900">+1 (800) FOOD-HUB</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-orange-500"><Mail size={18} /></div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">Support Email</p>
                       <p className="font-bold text-gray-900">support@foodhub.com</p>
                    </div>
                 </div>
              </div>
           </div>

           <Card className="p-8 md:p-10 border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-[80px]"></div>
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2">Your Name</label>
                       <Input placeholder="John Doe" className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2">Email Address</label>
                       <Input type="email" placeholder="john@example.com" className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white" required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2">Reason for Contact</label>
                    <div className="relative">
                       <Input placeholder="Technical Support, Delivery Issue..." className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white" />
                       <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-2">Detailed Message</label>
                    <textarea 
                      placeholder="Describe your query in detail..." 
                      className="w-full min-h-[120px] bg-gray-50 border-transparent focus:bg-white p-4 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-orange-500/10" 
                      required
                    ></textarea>
                 </div>
                 <Button className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold shadow-xl shadow-orange-500/20 group">
                    Send Message <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </form>
           </Card>
        </div>

        {/* Global Offices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { city: 'New York', address: '123 Culinary Drive, Food District, NY 10001', time: '9:00 AM - 6:00 PM' },
             { city: 'London', address: '45 Chef Gate, Central West, EC1V 9BD', time: '8:00 AM - 5:00 PM' },
             { city: 'Dubai', address: 'Sky Kitchen Tower, Business Bay, Level 42', time: '10:00 AM - 8:00 PM' },
           ].map((office, i) => (
             <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-gray-950 hover:text-white transition-all duration-500">
                <MapPin className="text-orange-500 mb-6" size={24} />
                <h4 className="text-xl font-bold mb-3">{office.city}</h4>
                <p className="text-gray-500 text-xs font-medium group-hover:text-gray-400 mb-6 leading-relaxed">{office.address}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                   <Clock size={14} className="text-orange-500" /> {office.time}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
