"use client";

import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { reviewService } from '@/services/reviewService';
import { Review } from '@/types';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await reviewService.getPublicTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50/50 overflow-hidden" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
           <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em] mb-4">Wall of Love</p>
           <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 leading-tight tracking-tight">
            What Our <span className="text-orange-500 italic">Customers</span> Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>
             ))
          ) : testimonials.map((item, index) => (
            <div 
              key={item.id || index} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-orange-50 text-orange-50 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < item.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-100'}`} />
                ))}
              </div>
              <p className="text-gray-600 font-medium italic mb-8 leading-relaxed flex-1 text-sm">
                 &quot;{item.comment}&quot;
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center font-black text-xs text-orange-600 shadow-sm uppercase">
                   {item.user?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm tracking-tight">{item.user?.name}</h4>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                     Verified Foodie
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
