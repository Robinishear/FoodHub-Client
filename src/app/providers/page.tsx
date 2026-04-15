/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Card, CardContent } from '@/components/ui/card';
import { providerService } from '@/services/providerService';
import { ProviderProfile } from '@/types';
import { ArrowLeft, MapPin, Star, Store, UtensilsCrossed, Sparkles, ChefHat, Search, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await providerService.getAll();
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch providers');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
    AOS.init({ duration: 800, once: true });
  }, []);

  const filteredProviders = providers.filter(p =>
    p.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cuisine && p.cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className='bg-[#F8F9FB] min-h-screen pt-24 pb-20'>
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-[#0F1115] rounded-3xl p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500 rounded-full blur-[180px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 rounded-full blur-[150px] opacity-10"></div>

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={16} /> Verified Partners
            </div>
            <h1 className='text-4xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-8'>
              The Art of <br /><span className='text-orange-500'>Local Kitchens.</span>
            </h1>
            <p className='text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mb-12'>
              Connecting you with the neighborhood's finest culinary talents and authentic home-style traditions.
            </p>

            {/* Search Interface */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-xl">
              <div className="relative grow">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Find a specific kitchen or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent h-14 pl-16 pr-6 rounded-2xl text-white font-bold outline-none placeholder:text-gray-600"
                />
              </div>
              <button className="h-14 px-8 bg-orange-500 hover:bg-orange-600 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                <Filter size={16} /> Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-4'>
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[3rem] h-[450px] animate-pulse"></div>
            ))}
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
            {filteredProviders.map((provider, i) => (
              <Link key={provider.id} href={`/providers/${provider.id}`} data-aos="fade-up" data-aos-delay={i * 50}>
                <Card className='group overflow-hidden border-none shadow-2xl shadow-gray-200/50 hover:shadow-orange-500/20 transition-all duration-700 rounded-[3rem] bg-white h-full flex flex-col hover:-translate-y-4'>
                  <div className='h-64 bg-gray-50 relative overflow-hidden flex items-center justify-center'>
                    <div className='absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
                    <div className='bg-orange-50 h-28 w-28 rounded-3xl flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-white'>
                      <ChefHat size={56} strokeWidth={1} />
                    </div>

                    <div className='absolute top-8 right-8'>
                      <div className='bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white flex items-center gap-2'>
                        <Star size={14} className='text-orange-500 fill-orange-500' />
                        <span className='text-[10px] font-black text-gray-900 uppercase tracking-widest'>
                          4.9 Rating
                        </span>
                      </div>
                    </div>

                    <div className='absolute bottom-8 left-8'>
                      <div className="px-5 py-2 bg-gray-950 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-2xl">
                        {provider.cuisine || 'Gourmet Master'}
                      </div>
                    </div>
                  </div>

                  <CardContent className='p-12 space-y-8 grow flex flex-col'>
                    <div className='space-y-4'>
                      <h3 className='text-3xl font-black text-gray-950 group-hover:text-orange-500 transition-colors leading-[1.1] tracking-tight'>
                        {provider.shopName}
                      </h3>
                      <div className='flex items-center text-gray-400 font-black text-[10px] uppercase tracking-widest bg-gray-50 w-fit px-3 py-1.5 rounded-lg'>
                        <MapPin size={12} className='mr-2 text-orange-500 shrink-0' />
                        <span className='truncate'>{provider.address.split(',')[0]}</span>
                      </div>
                    </div>

                    <p className='text-gray-500 text-sm leading-relaxed grow font-medium opacity-80'>
                      Specializing in sustainable, handcrafted meals. {provider.shopName} brings a unique perspective to local gastronomy.
                    </p>

                    <div className='pt-8 border-t border-gray-100 flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <div className='h-12 w-12 bg-gray-950 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-xl'>
                          <UtensilsCrossed size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Navigation</span>
                          <span className="text-sm font-black text-gray-900">View Menu</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 group-hover:translate-x-1">
                        <ArrowRight size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className='py-40 text-center bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden'>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10">
              <div className="h-32 w-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 text-gray-200 shadow-inner">
                <Store size={64} strokeWidth={1} />
              </div>
              <h3 className='text-4xl font-black text-gray-900 mb-6 tracking-tight'>
                No Matching <span className="text-orange-500">Kitchens.</span>
              </h3>
              <p className='text-gray-400 font-bold max-w-md mx-auto leading-relaxed text-lg mb-12'>
                Your search criteria didn't match any of our verified partners. Try broader terms or check back soon.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-12 h-14 bg-gray-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl shadow-gray-900/20 active:scale-95"
              >
                Clear Search Filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
