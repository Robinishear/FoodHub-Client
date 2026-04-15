'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency } from '@/lib/utils';
import { adminService } from '@/services/adminService';
import { Order } from '@/types';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const statusConfig = {
  PLACED: { color: 'bg-blue-100 text-blue-700', label: 'New Order' },
  PREPARING: { color: 'bg-orange-100 text-orange-700', label: 'In Kitchen' },
  READY: { color: 'bg-purple-100 text-purple-700', label: 'Ready' },
  DELIVERED: { color: 'bg-green-100 text-green-700', label: 'Delivered' },
  CANCELLED: { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Monitor every transaction across the ecosystem
      const ordersData = await adminService.getAllOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Global order audit failed:', error);
      toast.error('Failed to load platform transaction records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o: Order) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
    <ManagementPage
      title='Global Orders'
      description='Monitoring every transaction across the platform.'
      loading={loading}
      action={
        <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
          <div className='relative group'>
            <Search
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors'
              size={18}
            />
            <Input
              placeholder='Search by ID or name...'
              className='pl-10 h-11 w-full sm:w-64 border-gray-100 focus:border-orange-500 focus:ring-orange-500/10 transition-all rounded-md'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            title='Filter by Status'
            className='bg-white border border-gray-100 rounded-md px-4 py-2 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer h-11'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='ALL'>All Status</option>
            <option value='PLACED'>Placed</option>
            <option value='PREPARING'>Preparing</option>
            <option value='READY'>Ready</option>
            <option value='DELIVERED'>Delivered</option>
            <option value='CANCELLED'>Cancelled</option>
          </select>
        </div>
      }
    >
      <div className='space-y-6'>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: Order, idx: number) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className='premium-card group hover:scale-[1.01] overflow-hidden border-none shadow-sm'>
                <CardContent className='p-0 flex flex-col lg:flex-row lg:items-center'>
                  {/* ID & Status */}
                  <div className='p-8 lg:w-48 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-center space-y-2'>
                    <span className='text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none'>
                      Order ID
                    </span>
                    <span className='font-black text-gray-900 tracking-tight'>
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] w-fit px-2.5 py-1 rounded-full font-black uppercase tracking-widest mt-1 shadow-sm',
                        statusConfig[order.status as keyof typeof statusConfig]
                          ?.color
                      )}
                    >
                      {statusConfig[order.status as keyof typeof statusConfig]
                        ?.label || order.status}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className='p-8 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center space-x-4'>
                    <div className='h-12 w-12 bg-white rounded-md flex items-center justify-center text-orange-500 shadow-sm'>
                      <User size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1'>
                        Customer
                      </p>
                      <h4 className='font-bold text-gray-900 truncate leading-none'>
                        {order.user?.name || 'System User'}
                      </h4>
                      <p className='text-xs font-medium text-gray-500 truncate mt-1'>
                        {order.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Logistics */}
                  <div className='p-8 grow flex flex-col justify-center space-y-3'>
                    <div className='flex items-center text-sm font-bold text-gray-600'>
                      <MapPin size={16} className='text-orange-500 mr-3' />
                      <span className='truncate max-w-[200px]'>
                        {order.address}
                      </span>
                    </div>
                    <div className='flex items-center text-sm font-bold text-gray-600'>
                      <Calendar size={16} className='text-gray-400 mr-3' />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          { dateStyle: 'medium' }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Financials & Actions */}
                  <div className='text-right px-6'>
                    <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1'>
                      Revenue
                    </p>
                    <p className='text-2xl font-black text-orange-500 leading-none'>
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className='py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center'>
            <ShoppingBag size={64} className='text-gray-200 mb-6' />
            <h3 className='text-2xl font-black text-gray-900 tracking-tight'>
              No match found
            </h3>
            <p className='text-gray-500 font-medium'>
              The system has no records for this query.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
              variant='link'
              className='text-orange-500 mt-4 font-bold'
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </ManagementPage>
    </ProtectedRoute>
  );
}
