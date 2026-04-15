"use client";

import { CheckCircle2, Heart, Shield, Users, Zap, ArrowRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Narrative Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
                 <Heart size={14} className="text-orange-500 fill-orange-500" />
                 <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">Our Story</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 tracking-tighter leading-[0.95]">
                Redefining the <br /> <span className="text-orange-500 italic underline decoration-gray-950 decoration-4">Kitchen</span> Experience.
              </h1>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg">
                Born in 2026, FoodHub was created to bridge the gap between world-class culinary talent and hungry food enthusiasts. We believe every meal should be a masterpiece, and every chef should have a stage.
              </p>
              <div className="flex gap-4">
                 <Link href="/meals">
                   <Button className="h-12 px-8 rounded-xl bg-gray-950 text-white font-bold group">
                      Explore our Vision <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                   </Button>
                 </Link>
                 <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shadow-sm"><Play size={14} fill="currentColor" /></div>
                    <span className="text-sm font-bold text-gray-600">Our Culture</span>
                 </div>
              </div>
           </div>
           <div className="relative" data-aos="fade-left">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[100px] rounded-full"></div>
              <div className="relative z-10 grid grid-cols-2 gap-6">
                 <div className="space-y-6 pt-12">
                   <Image src="/food.jpeg" width={300} height={400} alt="Chef" className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500" />
                   <div className="bg-gray-950 text-white p-6 rounded-3xl space-y-2">
                      <p className="text-2xl font-black">250k+</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Partners</p>
                   </div>
                 </div>
                 <div className="space-y-6">
                   <div className="bg-orange-500 text-white p-6 rounded-3xl space-y-2">
                      <p className="text-2xl font-black">4.9/5</p>
                      <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Global Reviews</p>
                   </div>
                   <Image src="/shop.jpeg" width={300} height={400} alt="Kitchen" className="rounded-3xl shadow-xl hover:scale-105 transition-transform duration-500" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-50 mt-24">
         <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="max-w-3xl mx-auto space-y-4 mb-20">
               <h2 className="text-3xl font-bold text-gray-900 tracking-tight">The Three Pillars of FoodHub</h2>
               <p className="text-gray-500 font-medium">Everything we do is guided by these principles to ensure excellence.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { icon: <Shield size={24} />, title: 'Quality Zero', desc: 'No compromises. Every ingredient is checked twice for freshness and origin.' },
                 { icon: <Zap size={24} />, title: 'Hyper Speed', desc: 'Our logistics are powered by predictive AI to ensure delivery within 20 mins.' },
                 { icon: <Users size={24} />, title: 'Fair Market', desc: 'We take the lowest commission in the industry to empower our local chefs.' }
               ].map((pillar, i) => (
                 <div key={i} className="space-y-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">{pillar.icon}</div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-bold text-gray-900">{pillar.title}</h4>
                       <p className="text-gray-500 text-sm font-medium leading-relaxed">{pillar.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Team CTA */}
      <section className="py-32 container mx-auto px-4 text-center">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight">We are just getting <br /><span className="text-orange-500 italic">Started.</span></h2>
            <div className="flex flex-wrap justify-center gap-10">
               <div>
                  <p className="text-4xl font-black text-gray-900 mb-1">12M+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plates Served</p>
               </div>
               <div className="h-12 w-px bg-gray-100 hidden sm:block"></div>
               <div>
                  <p className="text-4xl font-black text-gray-900 mb-1">1.5M+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Eaters</p>
               </div>
               <div className="h-12 w-px bg-gray-100 hidden sm:block"></div>
               <div>
                  <p className="text-4xl font-black text-gray-900 mb-1">50+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Cities</p>
               </div>
            </div>
            <div className="pt-8">
               <Link href="/contact">
                 <Button className="h-14 px-12 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                    Join Our Mission
                 </Button>
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
