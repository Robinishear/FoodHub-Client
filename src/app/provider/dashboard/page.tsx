/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { StandardRoleDashboard } from '@/components/dashboard/StandardRoleDashboard';
import { formatCurrency } from '@/lib/utils';
import { providerService } from '@/services/providerService';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  Utensils,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProviderDashboard() {
  const [stats, setStats] = useState({
    totalMeals: 0,
    totalOrders: 0,
    averageRating: 0,
    earnings: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await providerService.getStats();
        setStats((prev) => ({
          ...prev,
          totalMeals: Number(data?.totalMeals ?? 0),
          totalOrders: Number(data?.totalOrders ?? 0),
          averageRating: Number(data?.averageRating ?? 0),
          earnings: Number(data?.totalEarnings ?? data?.earnings ?? 0),
          totalReviews: Number(data?.totalReviews ?? 0),
        }));
      } catch (error) {
        console.error('Dashboard statistics loading failed:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <StandardRoleDashboard
      roles={['PROVIDER']}
      title='Provider Dashboard'
      description='Manage your menu, orders, and kitchen performance.'
      statItems={[
        {
          title: 'Revenue Generated',
          value: formatCurrency(stats.earnings),
          trend: 'real',
          color: 'bg-green-50 text-green-600',
          icon: <DollarSign size={20} />,
        },
        {
          title: 'Active Meals',
          value: String(stats.totalMeals),
          trend: 'live',
          color: 'bg-orange-50 text-orange-600',
          icon: <Utensils size={20} />,
        },
        {
          title: 'Order Volume',
          value: String(stats.totalOrders),
          trend: 'total',
          color: 'bg-blue-50 text-blue-600',
          icon: <Package size={20} />,
        },
        {
          title: 'Kitchen Score',
          value: Number(stats.averageRating ?? 0).toFixed(1),
          trend: `${stats.totalReviews} reviews`,
          color: 'bg-purple-50 text-purple-600',
          icon: <TrendingUp size={20} />,
        },
      ]}
      quickLinks={[
        { title: 'Manage Menu', href: '/provider/menu', cta: 'Open' },
        { title: 'Order List', href: '/provider/orders', cta: 'Track' },
        { title: 'Customer Reviews', href: '/provider/reviews', cta: 'View' },
        { title: 'Create New Meal', href: '/provider/menu', cta: 'Add' },
      ]}
    />
  );
}
