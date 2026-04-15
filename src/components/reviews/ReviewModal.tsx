/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { reviewService } from '@/services/reviewService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Comment must be at least 3 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  mealId: string;
  orderId?: string;
  mealTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  mealId,
  mealTitle,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    try {
      await reviewService.createReview({
        mealId,
        orderId: '',
        rating,
        comment: data.comment,
      });
      toast.success('Review submitted! Thank you.');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in'>
      <div
        className='bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative'
        data-aos='zoom-in'
      >
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors'
        >
          <X size={24} />
        </button>

        <div className='text-center space-y-2 mb-10'>
          <h2 className='text-3xl font-black text-gray-900'>Rate Your Meal</h2>
          <p className='text-gray-500 font-medium'>
            How was the <b>{mealTitle}</b>?
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex justify-center space-x-2'>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => setRating(s)}
                className='transition-transform active:scale-90'
              >
                <Star
                  size={48}
                  className={cn(
                    'transition-colors',
                    s <= rating
                      ? 'text-orange-500 fill-orange-500'
                      : 'text-gray-200 fill-none'
                  )}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-gray-700 ml-1'>
              Your Feedback
            </label>
            <textarea
              {...register('comment')}
              className='w-full bg-gray-50 border-2 border-gray-100 rounded-md p-4 text-base focus:border-orange-500 focus:bg-white outline-none transition-all min-h-[120px] resize-none'
              placeholder='Tell us what you liked...'
            />
            {errors.comment && (
              <p className='text-xs text-red-500'>{errors.comment.message}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full h-14 rounded-md text-lg'
            isLoading={isLoading}
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
