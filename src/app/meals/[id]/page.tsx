'use client';

import { ReviewModal } from '@/components/reviews/ReviewModal';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { mealService } from '@/services/mealService';
import { reviewService } from '@/services/reviewService';
import { Meal, Review } from '@/types';
import { ArrowLeft, Clock, MessageSquare, ShoppingBag, Star, Utensils, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MealCard } from '@/components/meals/MealCard';

export default function MealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedMeals, setRelatedMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const reviewsData = await reviewService.getMealReviews(id as string);
      setReviews(reviewsData);
    } catch {
      console.error('Failed to load reviews');
    }
  };

  useEffect(() => {
    const fetchMealData = async () => {
      setLoading(true);
      try {
        const [mealData, reviewsData] = await Promise.all([
          mealService.getMealById(id as string),
          reviewService.getMealReviews(id as string),
        ]);
        setMeal(mealData);
        setReviews(reviewsData);

        if (mealData.categoryId) {
          const related = await mealService.getMeals({ categoryId: mealData.categoryId });
          setRelatedMeals((related?.data || []).filter((m: Meal) => m.id !== id).slice(0, 4));
        }
      } catch {
        toast.error('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    };
    fetchMealData();
  }, [id]);

  if (loading) return <FullPageLoader transparent />;
  if (!meal) return (
    <div className='min-h-screen flex flex-col items-center justify-center space-y-4'>
      <h1 className='text-xl font-bold'>Meal not found</h1>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  return (
    <div className='bg-white min-h-screen pt-28 pb-20'>
      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={12} />
          <Link href="/meals" className="hover:text-orange-500">Meals</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate max-w-[200px]">{meal.title}</span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
          {/* Gallery */}
          <div className='space-y-6'>
            <div className='aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group'>
              <Image
                src={meal.image || '/default-meal.jpg'}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                alt={meal.title}
                width={800}
                height={800}
              />
              {!meal.isAvailable && (
                <div className='absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center'>
                  <span className='bg-red-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs'>Sold Out</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="text-green-500" size={20} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                  <p className="text-xs font-bold text-gray-900">{meal.isAvailable ? 'Available' : 'Unavailable'}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                  <Clock className="text-orange-500" size={20} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Category</p>
                  <p className="text-xs font-bold text-gray-900">{meal.category?.name || 'General'}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                  <Zap className="text-blue-500" size={20} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Reviews</p>
                  <p className="text-xs font-bold text-gray-900">{reviews.length}</p>
               </div>
            </div>
          </div>

          {/* Info */}
          <div className='flex flex-col h-full'>
            <div className='space-y-6 flex-1'>
               <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-orange-100">
                     {meal.category?.name || 'Chef Choice'}
                  </span>
                  <div className='flex items-center text-orange-500 font-bold text-sm'>
                    <Star size={16} fill='currentColor' className='mr-1' />
                    <span>{meal.averageRating || 4.5}</span>
                    <span className="text-gray-400 ml-2 font-medium">({reviews.length} Feedbacks)</span>
                  </div>
               </div>

               <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight'>
                 {meal.title}
               </h1>

               <p className='text-gray-500 font-medium leading-relaxed'>
                 {meal.description || 'A masterpiece of culinary art, prepared with precision and passion.'}
               </p>

               <div className='py-6 border-y border-gray-50 flex items-center justify-between'>
                  <div className='space-y-1'>
                     <p className='text-[10px] font-bold uppercase text-gray-400 tracking-widest'>Price</p>
                     <p className='text-4xl font-bold text-gray-950'>{formatCurrency(meal.price)}</p>
                  </div>
                  <div className='flex items-center gap-3 bg-gray-50 p-2 rounded-xl'>
                     <button
                       className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white font-bold transition-colors'
                       onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                     >
                       -
                     </button>
                     <span className='w-6 text-center font-bold text-sm'>{quantity}</span>
                     <button
                       className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white font-bold transition-colors'
                       onClick={() => setQuantity((prev) => prev + 1)}
                     >
                       +
                     </button>
                  </div>
               </div>

               <Card className='p-6 bg-gray-950 text-white rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-black transition-all mb-8'>
                  <div className='flex items-center gap-4'>
                     <div className='h-12 w-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-lg group-hover:rotate-6 transition-transform'>
                        <Utensils size={24} />
                     </div>
                     <div>
                        <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Provided by</p>
                        <p className='font-bold'>{meal.provider?.shopName || 'Main Kitchen'}</p>
                     </div>
                  </div>
                  <ChevronRight size={24} className='text-gray-700 group-hover:text-orange-500' />
               </Card>
            </div>

            <Button
              className='w-full h-14 rounded-2xl text-md font-bold bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20'
              onClick={() => {
                // Keep one toast while still supporting multi-quantity add.
                addToCart(meal);
                for (let i = 1; i < quantity; i += 1) addToCart(meal);
              }}
              disabled={!meal.isAvailable}
            >
              <ShoppingBag size={20} className='mr-3' /> 
              {meal.isAvailable ? 'Add to bag' : 'Out of Stock'}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl text-sm font-bold mt-3"
              onClick={() => {
                addToCart(meal);
                for (let i = 1; i < quantity; i += 1) addToCart(meal);
                router.push('/cart');
              }}
              disabled={!meal.isAvailable}
            >
              Add & Go to Cart
            </Button>
          </div>
        </div>

        {/* Related */}
        {relatedMeals.length > 0 && (
          <div className="mt-24 space-y-8">
             <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pair with these</h2>
                <Link href="/meals" className="text-xs font-bold text-orange-500 underline underline-offset-4">Explore Menu</Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedMeals.map(m => <MealCard key={m.id} meal={m} />)}
             </div>
          </div>
        )}

        {/* Reviews */}
        <div className='mt-24 space-y-12'>
          <div className='flex items-center justify-between border-b border-gray-50 pb-6'>
             <h2 className='text-2xl font-bold text-gray-900'>What foodies say</h2>
             {user?.role === 'CUSTOMER' && (
                <Button variant="ghost" className="text-orange-500 font-bold hover:bg-orange-50 text-sm px-4" onClick={() => setIsReviewModalOpen(true)}>
                   <MessageSquare size={16} className="mr-2" /> Write Review
                </Button>
             )}
          </div>

          {reviews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {reviews.map((review) => (
                <Card key={review.id} className='p-6 rounded-2xl border-gray-100 shadow-sm space-y-4'>
                  <div className='flex justify-between items-start'>
                     <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs uppercase'>
                           {review.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                           <p className='text-sm font-bold'>{review.user?.name || 'Anonymous'}</p>
                           <p className='text-[10px] text-gray-400 font-medium'>{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className='flex items-center text-orange-500 text-xs font-bold group'>
                        <Star size={12} fill="currentColor" className="mr-1" /> {review.rating}
                     </div>
                  </div>
                  <p className='text-gray-600 text-sm font-medium leading-relaxed italic'>
                    &quot;{review.comment || 'No comment provided.'}&quot;
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className='py-16 text-center bg-gray-50 rounded-2xl border border-gray-100'>
               <p className='text-gray-400 font-bold uppercase text-[10px] tracking-widest'>No opinions yet</p>
            </div>
          )}
        </div>
      </div>
      
      {meal && (
        <ReviewModal
          mealId={meal.id}
          mealTitle={meal.title}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
}
