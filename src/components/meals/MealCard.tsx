'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Meal } from '@/types';
import { Clock, ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(meal);
    toast.success(`${meal.title} added to cart!`);
  };

  return (
    <div className='group relative'>
      <Card className='h-full overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 bg-white rounded-[32px] flex flex-col'>
        {/* Image Section */}
        <div className='relative h-60 shrink-0 overflow-hidden'>
          <Image
            src={meal.image || '/default-meal.jpg'}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
            alt={meal.title}
            width={400}
            height={300}
          />
          <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          
          <div className='absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-orange-500 text-sm shadow-xl'>
            {formatCurrency(meal.price)}
          </div>

          <Link href={`/meals/${meal.id}`} className="absolute top-5 right-5 h-10 w-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-900 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-500 hover:text-white">
             <ArrowUpRight size={20} />
          </Link>
          
          {meal.category && (
            <div className="absolute bottom-5 left-5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
               {meal.category.name}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className='p-8 flex flex-col flex-1 gap-4'>
          <div className='flex justify-between items-start'>
            <Link href={`/meals/${meal.id}`} className="flex-1">
              <h3 className='text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-1'>
                {meal.title}
              </h3>
            </Link>
            <div className='flex items-center text-orange-500 shrink-0 bg-orange-50 px-2 py-1 rounded-lg ml-2'>
              <Star size={12} fill='currentColor' />
              <span className='ml-1 text-xs font-bold'>
                {meal.averageRating || 4.5}
              </span>
            </div>
          </div>

          <p className='text-gray-400 text-sm line-clamp-2 font-medium leading-relaxed flex-1'>
            {meal.description || 'Delightful chef-crafted meal prepared with fresh ingredients.'}
          </p>

          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-orange-500" /> 25 min
             </div>
             <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
             <div className="flex items-center gap-1.5 line-clamp-1 max-w-[120px]">
                {meal.provider?.shopName || 'Main Kitchen'}
             </div>
          </div>

          <div className='pt-2'>
            <Button
              className='w-full h-11 rounded-xl font-bold text-sm bg-gray-950 hover:bg-orange-600 text-white transition-all shadow-md gap-2'
              onClick={handleAddToCart}
            >
              <ShoppingBag size={16} />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
