/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import {
  Clock,
  ShoppingBag,
  Star,
  MapPin,
  ChevronRight,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const statusStyles = {
  PLACED: 'bg-blue-50 text-blue-600',
  PREPARING: 'bg-orange-50 text-orange-600',
  READY: 'bg-purple-50 text-purple-600',
  DELIVERED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-600',
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await orderService.getProviderOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Orders load failed:', error);
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success(`Order set to ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error('Failed to update status.');
    }
  };

  const filteredOrders = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  return (
    <ManagementPage
      title='Active Shipments'
      description='Coordinate and bridge your kitchen with the doorstep.'
      loading={loading}
      action={
        <div className='flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100'>
          {['ALL', 'PLACED', 'PREPARING', 'READY', 'DELIVERED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all',
                filter === s
                  ? 'bg-white text-orange-500 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      <div className='grid grid-cols-1 gap-8'>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className='border-none shadow-xl shadow-gray-200/40 rounded-[2rem] overflow-hidden bg-white'>
              <CardContent className='p-6 flex flex-col xl:flex-row items-start gap-6'>
                <div className='h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors'>
                  <ShoppingBag size={26} />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:flex grow gap-5 w-full items-start'>
                  <div className='space-y-1 lg:w-44'>
                     <div className="flex items-center gap-2 mb-2">
                        <User size={12} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Client Identity</span>
                     </div>
                    <p className='text-md font-black text-gray-900 truncate'>{order.user?.name || 'Guest Eater'}</p>
                    <p className='text-[10px] font-bold text-gray-400 font-mono'>REF: {order.id.slice(-10).toUpperCase()}</p>
                  </div>

                  <div className='space-y-1 lg:w-44'>
                     <div className="flex items-center gap-2 mb-2">
                        <MapPin size={12} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Logistics Hub</span>
                     </div>
                    <p className='text-sm font-bold text-gray-500 line-clamp-2 leading-relaxed'>{order.address}</p>
                  </div>

                  <div className='space-y-1 lg:w-28'>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Valuation</span>
                     </div>
                    <p className='text-xl font-black text-gray-950'>{formatCurrency(order.totalAmount)}</p>
                  </div>

                  <div className='space-y-1'>
                    <span className={cn(
                        'px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest',
                        statusStyles[order.status as keyof typeof statusStyles]
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className='w-full xl:w-48 p-4 bg-gray-50 rounded-2xl space-y-3'>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Manifest</p>
                   <div className="space-y-2">
                      {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px]">
                           <span className="font-bold text-gray-700 truncate mr-4">{item.meal?.title}</span>
                           <span className="font-black text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md text-[10px]">x{item.quantity}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className='flex items-center gap-2 w-full xl:w-auto pt-4 xl:pt-0 border-t xl:border-t-0 border-gray-50'>
                   {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                     <div className="flex flex-wrap gap-2 justify-start xl:justify-end">
                        {order.status === 'PLACED' && (
                          <Button 
                            className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 font-black text-[10px] uppercase tracking-widest"
                            onClick={() => updateStatus(order.id, 'PREPARING')}
                          >Accept Packet</Button>
                        )}
                        {order.status === 'PREPARING' && (
                          <Button 
                            className="h-10 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 font-black text-[10px] uppercase tracking-widest"
                            onClick={() => updateStatus(order.id, 'READY')}
                          >Ready for Pickup</Button>
                        )}
                        {order.status === 'READY' && (
                          <Button 
                            className="h-10 px-4 rounded-xl bg-green-500 hover:bg-green-600 font-black text-[10px] uppercase tracking-widest"
                            onClick={() => updateStatus(order.id, 'DELIVERED')}
                          >Confirm Delivery</Button>
                        )}
                        <Button 
                          variant="ghost" 
                          className="h-10 px-4 rounded-xl text-red-500 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest"
                          onClick={() => updateStatus(order.id, 'CANCELLED')}
                        >Cancel Order</Button>
                     </div>
                   )}
                   {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                     <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Archived Case</span>
                        <ChevronRight size={16} />
                     </div>
                   )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100'>
            <div className='h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm'>
              <Clock size={32} />
            </div>
            <h3 className='text-3xl font-black text-gray-900 tracking-tight mb-2'>No active transmissions</h3>
            <p className='text-gray-400 font-medium text-sm mb-10'>Customer waves will appear here as soon as they reach our servers.</p>
            <Button className='rounded-2xl h-14 px-10 font-black bg-gray-950 hover:bg-orange-500 text-white shadow-2xl active:scale-95 transition-all' onClick={fetchOrders}>Sync Now</Button>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
