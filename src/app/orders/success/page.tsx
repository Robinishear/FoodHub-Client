/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ReviewModal } from '@/components/reviews/ReviewModal';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  ShoppingBag,
  Star,
  Truck,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const customerNavItems = [
  { title: 'Browse Menu', href: '/meals', icon: <ShoppingBag size={20} /> },
  { title: 'My Orders', href: '/orders', icon: <Package size={20} /> },
];

const statusConfig = {
  PLACED: {
    icon: <Clock size={16} />,
    color: 'bg-blue-100 text-blue-700',
    label: 'Order Placed',
  },
  PREPARING: {
    icon: <Package size={16} />,
    color: 'bg-orange-100 text-orange-700',
    label: 'Preparing',
  },
  READY: {
    icon: <CheckCircle2 size={16} />,
    color: 'bg-purple-100 text-purple-700',
    label: 'Ready for Delivery',
  },
  DELIVERED: {
    icon: <Truck size={16} />,
    color: 'bg-green-100 text-green-700',
    label: 'Delivered',
  },
  CANCELLED: {
    icon: <XCircle size={16} />,
    color: 'bg-red-100 text-red-700',
    label: 'Cancelled',
  },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState<{
    mealId: string;
    orderId: string;
    title: string;
  } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Use our professional order service to fetch customer's order history
      const ordersData = await orderService.getMyOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Order history load failed:', error);
      toast.error(
        'Failed to load your order history. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className='container mx-auto px-4 py-12'>
      {reviewOrder && (
        <ReviewModal
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          mealId={reviewOrder.mealId}
          orderId={reviewOrder.orderId}
          mealTitle={reviewOrder.title}
          onSuccess={fetchOrders}
        />
      )}
      <div className='mb-12'>
        <h1 className='text-4xl font-extra-bold text-gray-900 tracking-tight'>
          My Orders
        </h1>
        <p className='text-gray-500 font-medium'>
          Track and manage your recent meal orders.
        </p>
      </div>

      <div className='space-y-6'>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card
              key={order.id}
              className='border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'
            >
              <div className='flex flex-col md:flex-row'>
                <div className='p-8 border-r border-gray-50 md:w-1/3 bg-gray-50/50'>
                  <div className='flex justify-between items-start mb-6'>
                    <span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>
                      Order #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <div
                      className={cn(
                        'flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
                        statusConfig[order.status as keyof typeof statusConfig]
                          ?.color
                      )}
                    >
                      {
                        statusConfig[order.status as keyof typeof statusConfig]
                          ?.icon
                      }
                      <span>
                        {
                          statusConfig[
                            order.status as keyof typeof statusConfig
                          ]?.label
                        }
                      </span>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3 text-gray-500'>
                      <Calendar className='h-4 w-4' />
                      <span className='text-sm font-bold'>
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          { dateStyle: 'long' }
                        )}
                      </span>
                    </div>
                    <div className='flex items-start space-x-3 text-gray-500'>
                      <MapPin className='h-4 w-4 shrink-0 mt-0.5' />
                      <span className='text-sm font-bold line-clamp-2'>
                        {order.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='p-8 grow flex flex-col justify-between'>
                  <div className='space-y-3'>
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex justify-between items-center group/item'
                      >
                        <div className='flex items-center space-x-4'>
                          <span className='text-sm font-black text-orange-500'>
                            {item.quantity}x
                          </span>
                          <Link href={`/meals/${order.orderItems[0].mealId}`}>
                            <span className='text-sm font-bold text-gray-700'>
                              {item.meal.title}
                            </span>
                          </Link>
                          {order.status === 'DELIVERED' && (
                            <button
                              onClick={() =>
                                setReviewOrder({
                                  mealId: item.mealId,
                                  orderId: order.id,
                                  title: item.meal.title,
                                })
                              }
                              className='text-xs font-bold text-gray-400 hover:text-orange-500 transition-colors opacity-0 group-hover/item:opacity-100 flex items-center'
                            >
                              <Star size={12} className='mr-1' />
                              Rate Meal
                            </button>
                          )}
                        </div>
                        <span className='text-sm font-bold text-gray-900'>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className='pt-6 mt-6 border-t border-gray-50 flex justify-between items-end'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]'>
                        Paid Amount
                      </span>
                      <span className='text-2xl font-black text-orange-500'>
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <Link href={`/meals/${order.orderItems[0].mealId}`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='rounded-md font-bold'
                        >
                          Re-Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-24 text-center space-y-4 bg-gray-50 rounded-md border border-dashed border-gray-200'>
            <div className='h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300'>
              <ShoppingBag size={40} />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>No orders yet</h3>
            <p className='text-gray-500'>
              Discover delicious meals and treat yourself!
            </p>
            <Link href='/meals'>
              <Button className='rounded-md px-8'>Explor Menu</Button>
            </Link>
          </div>
        )}

        {loading && <FullPageLoader transparent />}
      </div>
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
    >
      <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
      <path d='M3 10h18' />
      <path d='M8 2v4' />
      <path d='M16 2v4' />
    </svg>
  );
}
