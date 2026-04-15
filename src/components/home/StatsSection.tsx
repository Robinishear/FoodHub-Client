"use client";

import { Users, Utensils, Star, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { metaService } from '@/services/metaService';

type PublicStats = {
  customers: number;
  chefs: number;
  rating: number;
  radius: number;
};

export function StatsSection() {
  const [statsData, setStatsData] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await metaService.getStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to load public stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Happy Customers', value: statsData ? (statsData.customers >= 1000 ? `${(statsData.customers / 1000).toFixed(1)}K+` : statsData.customers.toLocaleString()) : null, icon: <Users size={20} />, desc: 'Global trust footprint' },
    { label: 'Expert Chefs', value: statsData ? statsData.chefs.toLocaleString() : null, icon: <Utensils size={20} />, desc: 'Vetted culinary masters' },
    { label: 'Platform Rating', value: statsData ? statsData.rating.toFixed(1) : null, icon: <Star size={20} />, desc: 'Community score' },
    { label: 'Delivery Radius', value: statsData ? `${statsData.radius}` : null, icon: <Globe size={20} />, desc: 'Active coverage cities' },
  ];

  return (
    <section className="py-16 bg-gray-50/50 relative overflow-hidden" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden h-full min-h-[160px]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="space-y-4 relative z-10 h-full flex flex-col justify-between">
                <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shrink-0">
                  {stat.icon}
                </div>
                <div>
                   {loading || !stat.value ? (
                      <div className="space-y-2">
                         <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
                         <div className="h-3 w-16 bg-gray-50 animate-pulse rounded-full"></div>
                      </div>
                   ) : (
                      <>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className="text-[10px] font-medium text-gray-400">{stat.desc}</p>
                      </>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
