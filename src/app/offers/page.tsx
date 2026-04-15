"use client";

import { Ticket, Zap, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { metaService } from "@/services/metaService";
import Link from "next/link";

type OfferItem = {
  id: string;
  title: string;
  description: string;
  tag?: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await metaService.getOffers();
        setOffers(data || []);
      } catch {
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Code ${code} copied!`);
    } catch {
      toast.error("Unable to copy code");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
         {/* Header */}
         <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full text-orange-600 font-bold text-[10px] uppercase tracking-widest">
               <Zap size={14} fill="currentColor" /> Exclusive Deals
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
               Save Big on Every <span className="text-orange-500">Delicious</span> Bite.
            </h1>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
               Discover active promo codes, vouchers, and restaurant deals happening right now on FoodHub.
            </p>
         </div>

         {/* Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.length === 0 ? (
              <div className="md:col-span-2 p-10 rounded-3xl border border-dashed border-gray-200 text-center bg-white">
                <p className="text-base font-semibold text-gray-700">No active offers available</p>
                <p className="text-sm text-gray-500 mt-2">Admin can add offers from the Admin Offers page.</p>
              </div>
            ) : offers.map((offer) => (
              <Card key={offer.id} className="relative overflow-hidden group border-none shadow-xl bg-white rounded-3xl p-8 transition-all hover:-translate-y-1">
                 {/* Decorative Circle */}
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full group-hover:bg-orange-500 transition-colors duration-500"></div>
                 
                 <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600">
                             <Ticket size={20} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{offer.tag || "OFFER"}</span>
                       </div>
                       
                       <div>
                          <p className="text-2xl font-black text-orange-500 mb-1">
                            {offer.discountType === "PERCENTAGE"
                              ? `${offer.discountValue}% OFF`
                              : `${offer.discountValue} OFF`}
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{offer.title}</h3>
                          <p className="text-gray-500 font-medium text-xs mt-2">{offer.description}</p>
                       </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                       <div className="bg-gray-50 px-4 py-2 rounded-xl border border-dashed border-gray-300 flex items-center gap-4">
                          <span className="font-mono font-bold text-gray-900">{offer.code}</span>
                          <button onClick={() => copyToClipboard(offer.code)} className="text-gray-400 hover:text-orange-500 transition-colors">
                             <Copy size={16} />
                          </button>
                       </div>
                       <Link href="/meals">
                         <Button variant="ghost" className="text-sm font-bold text-gray-400 hover:text-gray-950 group/btn">
                            Explore <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                         </Button>
                       </Link>
                    </div>
                 </div>
              </Card>
            ))}
         </div>

         {/* Newsletter Context */}
         <div className="mt-20 p-10 bg-gray-950 rounded-[2.5rem] text-center text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-orange-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 space-y-6">
               <h3 className="text-2xl font-bold">Want more codes?</h3>
               <p className="text-gray-400 font-medium text-sm">Sign up for our VIP newsletter and get 15% off your next 10 orders.</p>
               <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                 <input placeholder="Enter institutional email" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange-500 transition-all font-medium" />
                 <Button className="h-auto py-3 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold">Get Secret Deals</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
