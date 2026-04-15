"use client";

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  CalendarDays,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Utensils,
  User,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import { DEMO_ACCOUNTS, type DemoAccount } from '@/lib/demoAccounts';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getGoogleAuthUrl } from '@/lib/apiUrl';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.login(data);
      login(token, user);
      toast.success(`Welcome back!`);
    } catch (error) {
      const message =
        (error as { userMessage?: string })?.userMessage || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoFields = (acc: DemoAccount) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
  };

  const loginAsDemo = async (acc: DemoAccount) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.login({
        email: acc.email,
        password: acc.password,
      });
      login(token, user);
      toast.success(`Signed in as ${acc.label}`);
    } catch (error) {
      const message =
        (error as { userMessage?: string })?.userMessage ||
        `Demo login failed for ${acc.label}. Run backend seed if users are missing.`;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const demoIcon = (role: DemoAccount['role']) => {
    const className = 'text-orange-500 shrink-0';
    switch (role) {
      case 'CUSTOMER':
        return <User size={14} className={className} />;
      case 'ADMIN':
        return <Shield size={14} className={className} />;
      case 'PROVIDER':
        return <Utensils size={14} className={className} />;
      case 'MANAGER':
        return <Users size={14} className={className} />;
      case 'ORGANIZER':
        return <CalendarDays size={14} className={className} />;
      default:
        return <User size={14} className={className} />;
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-20 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full translate-x-1/3'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-x-1/4'></div>

      {isLoading && <FullPageLoader message='Securing access...' transparent />}
      
      <div className='w-full max-w-lg relative z-10'>
        <Card className='border-none shadow-2xl shadow-gray-200/50 rounded-[2rem] bg-white overflow-hidden'>
          <div className="bg-gray-950 p-8 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl"></div>
             <div className="mx-auto w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
               <ShieldCheck size={24} />
             </div>
             <CardTitle className='text-2xl font-black italic tracking-tight mb-1'>Welcome Back</CardTitle>
             <CardDescription className='text-gray-400 font-medium text-sm'>Access your culinary headquarters</CardDescription>
          </div>

          <CardContent className='p-8 space-y-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-4'>
                <div className='relative'>
                   <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                   <Input
                    type='email'
                    placeholder='Email Address'
                    className='h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium'
                    {...register('email')}
                   />
                </div>
                {errors.email && <p className='text-[10px] text-red-500 font-bold ml-2 uppercase'>{errors.email.message}</p>}
                
                <div className='relative'>
                   <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                   <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    className='h-12 pl-12 pr-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium'
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
                {errors.password && <p className='text-[10px] text-red-500 font-bold ml-2 uppercase'>{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                 <Link href="/contact" className="text-xs font-bold text-orange-500 hover:underline">Need password help?</Link>
              </div>

              <Button type='submit' className='w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-lg transition-all active:scale-95 group'>
                Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Demo logins — matches `src/lib/demoAccounts.ts` + `npm run seed` in backend */}
            <div className='space-y-3 pt-2'>
              <p className='text-center text-[10px] font-black uppercase tracking-widest text-gray-400'>
                Demo login (one tap)
              </p>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {DEMO_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.email}
                    className='rounded-xl border border-gray-100 bg-gray-50 p-2 flex flex-col gap-1.5'
                  >
                    <Button
                      type='button'
                      variant='outline'
                      disabled={isLoading}
                      onClick={() => loginAsDemo(acc)}
                      className='h-10 rounded-lg border-gray-200 bg-white hover:bg-orange-50 font-black text-[10px] uppercase tracking-tight w-full'
                    >
                      <span className='flex items-center justify-center gap-1.5'>
                        {demoIcon(acc.role)}
                        {acc.label}
                      </span>
                    </Button>
                    <button
                      type='button'
                      disabled={isLoading}
                      className='text-[9px] font-medium text-gray-400 hover:text-orange-500 underline-offset-2 hover:underline text-center w-full py-0.5'
                      onClick={() => {
                        fillDemoFields(acc);
                        toast.success('Credentials filled — press Sign In');
                      }}
                    >
                      Fill form only
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='relative py-2'>
              <div className='absolute inset-0 flex items-center'><span className='w-full border-t border-gray-100'></span></div>
              <div className='relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400'><span className='bg-white px-3'>Or connect with</span></div>
            </div>

            <Button
              variant='outline'
              className='w-full h-11 rounded-xl border-gray-100 bg-gray-50 hover:bg-white font-bold flex gap-3 text-sm'
              type='button'
              onClick={() => {
                window.location.href = getGoogleAuthUrl();
              }}
            >
              <img src='https://www.google.com/favicon.ico' className='w-4 h-4' alt='Google' />
              Google Authentication
            </Button>

            <div className='text-center pt-4'>
              <p className='text-gray-400 text-sm font-medium'>
                New here?{' '}
                <Link href='/register' className='text-gray-950 font-bold hover:underline underline-offset-4 decoration-orange-500 decoration-2 transition-all'>
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
