"use client";

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getGoogleAuthUrl } from '@/lib/apiUrl';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { User, Mail, Lock, Building, MapPin, Utensils, Zap, ArrowRight, Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'PROVIDER', 'MANAGER', 'ORGANIZER']),
    shopName: z.string().optional(),
    address: z.string().optional(),
    cuisine: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'PROVIDER') {
        return !!data.shopName && !!data.address && !!data.cuisine;
      }
      return true;
    },
    {
      message: 'Provider details are required',
      path: ['shopName'],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const paramRole = searchParams.get('role');
  const initialRole: RegisterFormValues['role'] =
    paramRole === 'CUSTOMER' ||
    paramRole === 'PROVIDER' ||
    paramRole === 'MANAGER' ||
    paramRole === 'ORGANIZER'
      ? paramRole
      : 'CUSTOMER';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (
      paramRole === 'CUSTOMER' ||
      paramRole === 'PROVIDER' ||
      paramRole === 'MANAGER' ||
      paramRole === 'ORGANIZER'
    ) {
      setValue('role', paramRole);
    }
  }, [paramRole, setValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        ...(data.role === 'PROVIDER' ? {} : { shopName: undefined, address: undefined, cuisine: undefined })
      };
      await authService.register(payload);
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (error) {
      const message =
        (error as { userMessage?: string })?.userMessage || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') router.replace('/admin/dashboard');
      else if (user.role === 'PROVIDER') router.replace('/provider/dashboard');
      else if (user.role === 'MANAGER') router.replace('/dashboard/manager');
      else if (user.role === 'ORGANIZER') router.replace('/dashboard/organizer');
      else if (user.role === 'CUSTOMER') router.replace('/dashboard/customer');
      else router.replace('/dashboard/customer');
    }
  }, [loading, user, router]);

  if (loading || user) {
    return <FullPageLoader transparent />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 pt-32 pb-20 px-4 relative overflow-hidden'>
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      {isLoading && <FullPageLoader message='Assembling your profile...' transparent />}
      
      <div className='w-full max-w-xl relative z-10'>
        <Card className='border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white overflow-hidden'>
          <div className="bg-gray-950 p-10 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl"></div>
             <CardTitle className='text-3xl font-black italic tracking-tighter mb-2'>Join Food<span className="text-orange-500">Hub</span></CardTitle>
             <CardDescription className='text-gray-400 font-medium'>Create an account to start your culinary journey</CardDescription>
          </div>

          <CardContent className='p-8 md:p-12 space-y-8'>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Role</label>
              <select
                {...register('role')}
                className="w-full h-12 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-orange-500"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="PROVIDER">Provider</option>
                <option value="MANAGER">Manager</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='space-y-4'>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    placeholder='Full Name' 
                    className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('name')} 
                   />
                </div>
                {errors.name && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.name.message}</p>}

                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    type="email"
                    placeholder='Email Address' 
                    className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('email')} 
                   />
                </div>
                {errors.email && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.email.message}</p>}

                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password' 
                    className="h-12 pl-12 pr-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('password')} 
                   />
                   <button
                     type='button'
                     onClick={() => setShowPassword(!showPassword)}
                     className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors'
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>
                {errors.password && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.password.message}</p>}

                {selectedRole === 'PROVIDER' && (
                  <div className='space-y-4 pt-2 animate-in fade-in slide-in-from-top-2'>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-4 flex items-center gap-3">
                       <Zap size={20} className="text-orange-500" />
                       <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Kitchen Details Required</p>
                    </div>
                    <div className="relative">
                       <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Shop/Kitchen Name' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('shopName')} />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Operational Address' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('address')} />
                    </div>
                    <div className="relative">
                       <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Cuisine Specialties' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('cuisine')} />
                    </div>
                  </div>
                )}
              </div>

              <Button type='submit' className='w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95 group'>
                Create Account <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className='relative py-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-gray-100' />
              </div>
              <div className='relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400'>
                <span className='bg-white px-3'>Or connect with</span>
              </div>
            </div>

            <Button
              type='button'
              variant='outline'
              className='w-full h-12 rounded-xl border-gray-100 bg-gray-50 hover:bg-white font-bold flex gap-3 text-sm'
              onClick={() => {
                window.location.href = getGoogleAuthUrl({ role: selectedRole });
              }}
            >
              <img src='https://www.google.com/favicon.ico' className='w-4 h-4' alt='' />
              Google (uses selected role)
            </Button>

            <div className='text-center pt-4'>
              <p className='text-gray-400 text-sm font-medium'>
                Already a member?{' '}
                <Link href='/login' className='text-gray-950 font-bold hover:underline underline-offset-4 decoration-orange-500 decoration-2 transition-all'>
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
