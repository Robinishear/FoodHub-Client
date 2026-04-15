'use client';

import { MealCard } from '@/components/meals/MealCard';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { providerService } from '@/services/providerService';
import { Meal, ProviderProfile } from '@/types';
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShoppingBag,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProviderShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      try {
        const data = await providerService.getById(id);
        setProvider(data);
      } catch (error) {
        toast.error('Failed to load provider shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [id]);

  if (loading) {
    return <FullPageLoader transparent />;
  }

  if (!provider) {
    return (
      <div className='container mx-auto px-4 py-32 text-center space-y-6'>
        <h1 className='text-4xl font-black text-gray-900'>Kitchen not found</h1>
        <Link href='/providers'>
          <Button variant='outline'>Back to All Kitchens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-12 min-h-screen'>
      <Link
        href='/providers'
        className='text-orange-500 font-bold flex items-center mb-8 group'
      >
        <ArrowLeft
          size={18}
          className='mr-2 group-hover:-translate-x-1 transition-transform'
        />{' '}
        All Kitchens
      </Link>

      <div className='space-y-16'>
        {/* Header Section */}
        <div className='relative bg-[#1C1C1C] rounded-[3rem] p-12 md:p-20 overflow-hidden text-white shadow-2xl'>
          <div className='absolute -top-24 -right-24 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-20'></div>
          <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-10'></div>

          <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <span className='bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest'>
                    Premium Kitchen
                  </span>
                  <div className='h-1 w-8 bg-gray-700 rounded-full'></div>
                </div>
                <h1 className='text-5xl md:text-7xl font-black tracking-tight'>
                  {provider.shopName}
                </h1>
                <div className='flex items-center text-gray-400 font-bold'>
                  <MapPin size={20} className='mr-2 text-orange-500' />
                  <span className='text-lg'>{provider.address}</span>
                </div>
              </div>

              <div className='flex flex-wrap gap-6'>
                <div className='flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-md'>
                  <Star size={20} className='text-orange-500 fill-orange-500' />
                  <span className='font-bold'>4.8 Rating</span>
                </div>
                <div className='flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-md'>
                  <Clock size={20} className='text-blue-400' />
                  <span className='font-bold'>30-45 Mins</span>
                </div>
                <div className='flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-md'>
                  <UtensilsCrossed size={20} className='text-orange-500' />
                  <span className='font-bold'>
                    {provider.meals?.length || 0} Dishes
                  </span>
                </div>
              </div>

              <p className='text-gray-400 text-lg leading-relaxed max-w-xl'>
                {provider.cuisine ||
                  'Welcome to our kitchen! We take pride in serving high-quality, delicious meals crafted with passion and the finest ingredients.'}
              </p>
            </div>

            <div className='hidden lg:flex items-center justify-center'>
              <div className='h-80 w-80 bg-linear-to-br from-white/5 to-white/0 border border-white/10 rounded-[4rem] flex items-center justify-center relative rotate-6 group'>
                <Store
                  size={128}
                  className='text-white/20 group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-[4rem]'></div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className='space-y-12 pb-24'>
          <div className='flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 pb-8'>
            <h2 className='text-5xl font-black text-gray-900 tracking-tight'>
              Our <span className='text-orange-500'>Menu</span>
            </h2>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-400 font-bold uppercase tracking-widest text-xs'>
                Total {provider.meals?.length || 0} items available
              </span>
            </div>
          </div>

          {!provider.meals || provider.meals.length === 0 ? (
            <div className='py-32 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200'>
              <ShoppingBag size={64} className='mx-auto text-gray-200 mb-6' />
              <h3 className='text-2xl font-bold text-gray-900'>
                Menu is currently empty
              </h3>
              <p className='text-gray-500'>
                Check back later for delicious offerings from this kitchen.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {provider.meals.map((meal: Meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
