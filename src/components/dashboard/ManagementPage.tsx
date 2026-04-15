'use client';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { cn } from '@/lib/utils';
import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getNavigationForRole } from '@/constants/navigation';

interface ManagementPageProps {
  title: string;
  description: string;
  items?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
  children: React.ReactNode;
  loading?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function ManagementPage({
  title,
  description,
  items,
  children,
  loading = false,
  action,
  className,
}: ManagementPageProps) {
  const { user } = useAuth();
  const navItems = items || (user ? getNavigationForRole(user.role) : []);

  return (
    <DashboardLayout items={navItems}>
      <div className={cn('space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000', className)}>
        {/* Premium Header Section */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-8 border-b border-gray-100/50'>
          <div className='space-y-4'>
            <div className="flex items-center gap-4">
               <div className="h-2 w-12 bg-orange-500 rounded-full shadow-glow"></div>
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">Integrated Hub</span>
            </div>
            <div>
              <h1 className='text-4xl md:text-5xl font-black text-gray-950 tracking-tighter leading-none mb-3'>
                 {title}
              </h1>
              <p className='text-sm font-medium text-gray-500 max-w-xl leading-relaxed'>{description}</p>
            </div>
          </div>
          {action && <div className='shrink-0 w-full lg:w-auto'>{action}</div>}
        </div>

        {/* Dynamic Content Buffer */}
        <div className='relative min-h-[500px]'>
           {children}
           {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center">
                <FullPageLoader transparent mode='local' />
             </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}
