import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Grid, 
  ShoppingBag, 
  ShieldAlert, 
  Utensils, 
  Star, 
  Settings, 
  Heart, 
  Clock3, 
  UserCircle2,
  Megaphone,
  BadgePercent,
  Newspaper,
  MailQuestion,
  Activity,
  ClipboardList
} from 'lucide-react';
import { Role } from '@/types';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const getNavigationForRole = (role: Role | string): NavItem[] => {
  switch (role) {
    case 'ADMIN':
      return [
        { title: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { title: 'Profile', href: '/admin/profile', icon: <UserCircle2 size={20} /> },
        { title: 'User Management', href: '/admin/users', icon: <Users size={20} /> },
        { title: 'Categories', href: '/admin/categories', icon: <Grid size={20} /> },
        { title: 'Offers', href: '/admin/offers', icon: <BadgePercent size={20} /> },
        { title: 'All Orders', href: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { title: 'Moderation', href: '/admin/reviews', icon: <ShieldAlert size={20} /> },
      ];
    case 'PROVIDER':
      return [
        { title: 'Dashboard', href: '/provider/dashboard', icon: <LayoutDashboard size={20} /> },
        { title: 'Manage Menu', href: '/provider/menu', icon: <Utensils size={20} /> },
        { title: 'Order List', href: '/provider/orders', icon: <ShoppingBag size={20} /> },
        { title: 'Reviews', href: '/provider/reviews', icon: <Star size={20} /> },
        { title: 'Profile', href: '/provider/profile', icon: <UserCircle2 size={20} /> },
      ];
    case 'MANAGER':
      return [
        { title: 'Dashboard', href: '/dashboard/manager', icon: <LayoutDashboard size={20} /> },
        { title: 'Profile', href: '/dashboard/manager/profile', icon: <UserCircle2 size={20} /> },
        { title: 'Orders Queue', href: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { title: 'Users Directory', href: '/admin/users', icon: <Users size={20} /> },
        { title: 'Moderation Control', href: '/admin/reviews', icon: <ShieldAlert size={20} /> },
      ];
    case 'ORGANIZER':
      return [
        { title: 'Dashboard', href: '/dashboard/organizer', icon: <LayoutDashboard size={20} /> },
        { title: 'Profile', href: '/dashboard/organizer/profile', icon: <UserCircle2 size={20} /> },
        { title: 'Promotions', href: '/offers', icon: <BadgePercent size={20} /> },
        { title: 'Editor Portal', href: '/blog', icon: <Newspaper size={20} /> },
        { title: 'Help Desk', href: '/contact', icon: <MailQuestion size={20} /> },
      ];
    case 'CUSTOMER':
      return [
        { title: 'Dashboard', href: '/dashboard/customer', icon: <LayoutDashboard size={20} /> },
        { title: 'Profile', href: '/dashboard/customer/profile', icon: <UserCircle2 size={20} /> },
        { title: 'My Orders', href: '/dashboard/customer/orders', icon: <Clock3 size={20} /> },
        { title: 'Activity', href: '/dashboard/customer/activity', icon: <Activity size={20} /> },
        { title: 'Settings', href: '/dashboard/customer/settings', icon: <Settings size={20} /> },
        { title: 'Meals', href: '/dashboard/customer/meals', icon: <Heart size={20} /> },
      ];
    default:
      // Fallback to customer console for unknown role strings
      return [
        { title: 'Dashboard', href: '/dashboard/customer', icon: <LayoutDashboard size={20} /> },
        { title: 'Profile', href: '/dashboard/customer/profile', icon: <UserCircle2 size={20} /> },
        { title: 'My Orders', href: '/dashboard/customer/orders', icon: <Clock3 size={20} /> },
        { title: 'Meals', href: '/meals', icon: <Heart size={20} /> },
      ];
  }
};
