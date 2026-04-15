/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { adminService } from '@/services/adminService';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Star, Trash2, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminReviewsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
      <AdminReviewsPageContent />
    </ProtectedRoute>
  );
}

function AdminReviewsPageContent() {
  const { user } = useAuth();
  const canDeleteReviews = user?.role === 'ADMIN';
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Use platform service for cross-system feedback management
      const data = await adminService.reviews.getAll();
      setReviews(data);
    } catch (error) {
      console.error('Global reviews load failed:', error);
      toast.error('Failed to load platform-wide reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to permanently delete this review? This action cannot be undone.'
      )
    )
      return;
    try {
      // Clean up reviews using professional admin service
      await adminService.reviews.delete(id);
      toast.success('Review deleted successfully.');
      fetchReviews();
    } catch (error: any) {
      console.error('Review deletion failed:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review.');
    }
  };

  return (
    <ManagementPage
      title='Review Moderation'
      description='Oversee and manage customer feedback across the ecosystem.'
      loading={loading}
    >
      <div className='grid grid-cols-1 gap-6'>
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className='premium-card overflow-hidden border-none shadow-sm group hover:scale-[1.005] transition-all'>
                <CardContent className='p-0 flex flex-col lg:flex-row'>
                  {/* User & Rating */}
                  <div className='p-8 lg:w-64 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center'>
                    <div className='flex items-center space-x-3 mb-4'>
                      <div className='h-10 w-10 bg-white rounded-md flex items-center justify-center text-gray-400 shadow-sm'>
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 leading-none'>
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1'>
                          Reviewer
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-1'>
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

                  {/* Review Content */}
                  <div className='p-8 grow space-y-4'>
                    <div className='flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      <MessageSquare size={12} className='text-orange-500' />
                      <span>Meal: {review.meal?.title || 'Unknown Meal'}</span>
                    </div>
                    <p className='text-gray-600 font-medium italic leading-relaxed text-sm'>
                      {review.comment || 'No comment provided by the user.'}
                    </p>
                    <div className='flex items-center space-x-6 pt-2'>
                      <div className='flex items-center text-[10px] font-bold text-gray-400'>
                        <Calendar size={12} className='mr-2' />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions (admin only) */}
                  {canDeleteReviews && (
                    <div className='p-8 lg:w-48 flex items-center justify-center lg:justify-end'>
                      <Button
                        variant='destructive'
                        size='sm'
                        className='rounded-md font-black px-6 shadow-lg shadow-red-500/10'
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 size={16} className='mr-2' /> Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className='py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100'>
            <Star size={64} className='mx-auto text-gray-200 mb-6' />
            <h3 className='text-2xl font-black text-gray-900'>
              No reviews found
            </h3>
            <p className='text-gray-500'>
              The platform hasn't received any feedback yet.
            </p>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
