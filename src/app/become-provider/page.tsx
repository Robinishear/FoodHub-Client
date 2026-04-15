"use client";

import { CheckCircle2, DollarSign, Globe, Star, Users, Utensils, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function BecomeProviderPage() {
   return (
      <div className="flex flex-col min-h-screen bg-white pt-20">
         {/* Hero Section */}
         <section className="relative py-24 px-4 overflow-hidden border-b border-gray-100">
            <div className="container mx-auto max-w-6xl">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                        <Star size={14} className="text-orange-500 fill-orange-500" />
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Partner with us</span>
                     </div>
                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-tight">
                        Turn your kitchen <br /> into a <span className="text-orange-500">Global Brand.</span>
                     </h1>
                     <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg">
                        Join thousands of chefs and restaurants reaching millions of customers
                        every day. We provide the technology, the delivery, and the growth.
                     </p>
                     <div className="flex gap-4">
                        <Link href="/register?role=PROVIDER">
                           <Button className="h-12 px-8 rounded-xl bg-gray-950 text-white font-bold hover:bg-orange-500 transition-all shadow-lg">
                              Get Started Now
                           </Button>
                        </Link>
                        <Link href="/faq">
                           <Button variant="outline" className="h-12 px-8 rounded-xl border-gray-200 text-gray-600 font-bold">
                              View Requirements
                           </Button>
                        </Link>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="absolute inset-0 bg-orange-500/10 rounded-3xl blur-3xl"></div>
                     <Image
                        src="/food.jpeg"
                        width={600}
                        height={400}
                        alt="Chef cooking"
                        className="rounded-3xl shadow-2xl relative z-10"
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* Stats/Benefits */}
         <section className="py-20 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  {
                     icon: <DollarSign className="text-orange-500" />,
                     title: "Scale Earnings",
                     desc: "Average partners see a 40% increase in monthly revenue within 3 months."
                  },
                  {
                     icon: <Users className="text-orange-500" />,
                     title: "Reach Millions",
                     desc: "Get access to our massive user base looking for quality food in your area."
                  },
                  {
                     icon: <Zap className="text-orange-500" />,
                     title: "Active Logistics",
                     desc: "Forget delivery logistics. Our hyper-local fleet handles everything for you."
                  }
               ].map((benefit, i) => (
                  <Card key={i} className="p-8 rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all">
                     <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">{benefit.icon}</div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">{benefit.desc}</p>
                  </Card>
               ))}
            </div>
         </section>

         {/* How it works */}
         <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
               <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Three simple steps to launch</h2>
                  <p className="text-gray-500 font-medium">From registration to your first order, we make the process seamless.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  {[
                     { title: "Register", desc: "Submit your details and legal documents for verification." },
                     { title: "Onboard", desc: "Receive our partner kit and set up your digital menu." },
                     { title: "Start Cooking", desc: "Go live on the hub and start receiving real-time orders." }
                  ].map((step, i) => (
                     <div key={i} className="relative space-y-4">
                        <div className="h-12 w-12 bg-gray-950 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xl">
                           {i + 1}
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                        <p className="text-gray-500 text-xs font-medium px-8">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Call to Action */}
         <section className="py-24 container mx-auto px-4">
            <div className="bg-orange-500 rounded-[2.5rem] p-12 md:p-20 text-white text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10 space-y-8">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to serve the world?</h2>
                  <p className="text-orange-50 font-medium text-lg max-w-2xl mx-auto">Join the FoodHub family today and discover why thousands of chefs choose us as their growth partner.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                     <Link href="/register?role=PROVIDER">
                        <Button className="h-14 px-10 rounded-xl bg-white text-orange-600 font-bold hover:bg-orange-50 transition-all shadow-xl">
                           Apply to Join
                        </Button>
                     </Link>
                     <Button variant="outline" className="h-14 px-10 rounded-xl bg-white text-orange-600 font-bold hover:bg-orange-50 transition-all shadow-xl">
                        Talk to an Agent
                     </Button>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
}
