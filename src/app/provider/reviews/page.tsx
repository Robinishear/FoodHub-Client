'use client';

import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { mealService } from '@/services/mealService';
import { reviewService } from '@/services/reviewService';
import { Meal, Review } from '@/types';
import { motion } from 'framer-motion';
import {
  Calendar,
  MessageSquare,
  Star,
  User,
  Utensils,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { meal: Meal })[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Fetch provider's meals using our service
        const meals = await mealService.getProviderMeals();

        // Fetch reviews for each meal using our service
        const reviewPromises = meals.map((meal: Meal) =>
          reviewService.getMealReviews(meal.id).catch(() => [])
        );
        const reviewsDatas = await Promise.all(reviewPromises);

        // Combine all reviews with meal info
        const allReviews = reviewsDatas.flatMap((data, idx) =>
          data.map((review: Review) => ({
            ...review,
            meal: meals[idx],
          }))
        );

        setReviews(allReviews);

        // Calculate stats
        const totalReviews = allReviews.length;
        const averageRating =
          totalReviews > 0
            ? allReviews.reduce((acc: number, r) => acc + r.rating, 0) /
              totalReviews
            : 0;

        setStats({
          totalReviews,
          averageRating,
          fiveStars: allReviews.filter((r) => r.rating === 5).length,
          fourStars: allReviews.filter((r) => r.rating === 4).length,
          threeStars: allReviews.filter((r) => r.rating === 3).length,
          twoStars: allReviews.filter((r) => r.rating === 2).length,
          oneStars: allReviews.filter((r) => r.rating === 1).length,
        });
      } catch (error) {
        console.error('Provider reviews load failed:', error);
        toast.error('Failed to load customer feedback. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <ManagementPage
      title='Customer Reviews'
      description='See what your customers are saying about your meals'
      loading={loading}
    >
      <div className='space-y-12'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card className='border-none shadow-sm bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs font-black uppercase text-gray-400 tracking-widest'>
                    Total Reviews
                  </p>
                  <p className='text-3xl font-black text-gray-900 mt-2'>
                    {stats.totalReviews}
                  </p>
                </div>
                <div className='h-12 w-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-600'>
                  <MessageSquare size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm bg-white'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs font-black uppercase text-gray-400 tracking-widest'>
                    Average Rating
                  </p>
                  <div className='flex items-center space-x-2 mt-2'>
                    <p className='text-3xl font-black text-orange-500'>
                      {stats.averageRating.toFixed(1)}
                    </p>
                    <Star
                      size={20}
                      className='text-orange-500 fill-orange-500'
                    />
                  </div>
                </div>
                <div className='h-12 w-12 bg-orange-50 rounded-md flex items-center justify-center text-orange-600'>
                  <Star size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-none shadow-sm bg-white'>
            <CardContent className='p-6'>
              <div className='space-y-2'>
                <p className='text-xs font-black uppercase text-gray-400 tracking-widest'>
                  Rating Distribution
                </p>
                <div className='space-y-1'>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats[
                      `${['one', 'two', 'three', 'four', 'five'][rating - 1]}Stars` as keyof typeof stats
                    ] as number;
                    const percentage =
                      stats.totalReviews > 0
                        ? (count / stats.totalReviews) * 100
                        : 0;
                    return (
                      <div key={rating} className='flex items-center space-x-2'>
                        <span className='text-xs font-bold text-gray-600 w-3'>
                          {rating}
                        </span>
                        <Star
                          size={12}
                          className='text-orange-500 fill-orange-500'
                        />
                        <div className='grow bg-gray-100 h-2 rounded-full overflow-hidden'>
                          <div
                            className='bg-orange-500 h-full transition-all'
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className='text-xs font-bold text-gray-400 w-8'>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-black text-gray-900'>All Feedback</h2>
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className='border border-gray-100 shadow-sm hover:shadow-md transition-all'>
                  <CardContent className='p-8 flex flex-col lg:flex-row gap-6'>
                    {/* Customer Info */}
                    <div className='lg:w-48 flex items-center space-x-4 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-3'>
                      <div className='h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-600'>
                        <User size={20} />
                      </div>
                      <div>
                        <p className='font-bold text-gray-900'>
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <div className='flex items-center space-x-1 mt-1'>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={cn(
                                s <= review.rating
                                  ? 'text-orange-500 fill-orange-500'
                                  : 'text-gray-200'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className='grow space-y-3'>
                      <div className='flex items-center space-x-2'>
                        <Utensils size={14} className='text-orange-500' />
                        <p className='text-sm font-black uppercase text-gray-400 tracking-widest'>
                          {review.meal?.title}
                        </p>
                      </div>
                      <p className='text-gray-700 font-medium leading-relaxed italic'>
                        &quot;{review.comment || 'No comment provided.'}&quot;
                      </p>
                      <div className='flex items-center text-xs text-gray-400 font-bold'>
                        <Calendar size={12} className='mr-2' />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className='py-32 text-center bg-gray-50 rounded-md border-2 border-dashed border-gray-100'>
              <Star size={64} className='mx-auto text-gray-200 mb-6' />
              <h3 className='text-2xl font-black text-gray-900'>
                No reviews yet
              </h3>
              <p className='text-gray-500'>
                Your customers haven&apos;t left any feedback yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </ManagementPage>
  );
}
