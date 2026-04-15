/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { FAQ } from '@/components/home/FAQ';
import { StatsSection } from '@/components/home/StatsSection';
import { Testimonials } from '@/components/home/Testimonials';
import { TrendingOffers } from '@/components/home/TrendingOffers';
import { Button } from '@/components/ui/button';
import { mealService } from '@/services/mealService';
import { HomeContent, metaService } from '@/services/metaService';
import { useAuth } from '@/context/AuthContext';
import { Category, Meal } from '@/types';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  Star,
  Utensils,
  Zap,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { MealCard } from '@/components/meals/MealCard';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [publicStats, setPublicStats] = useState<{
    customers: number;
    radius: number;
  } | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, mealsData, homeContentData, statsData] = await Promise.all([
          mealService.getCategories(),
          mealService.getMeals({ limit: 4 }),
          metaService.getHomeContent(),
          metaService.getStats(),
        ]);

        setCategories(categoriesData.slice(0, 6));
        setFeaturedMeals(mealsData.data);
        setHomeContent(homeContentData);
        setPublicStats({
          customers: Number(statsData?.customers || 0),
          radius: Number(statsData?.radius || 0),
        });
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setCategories([]);
        setFeaturedMeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setNewsletterLoading(true);
    try {
      await metaService.subscribeNewsletter(newsletterEmail.trim());
      toast.success('Subscribed successfully');
      setNewsletterEmail('');
    } catch (error: any) {
      toast.error(error?.userMessage || 'Subscription failed');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <main className='min-h-screen overflow-hidden bg-white' suppressHydrationWarning>
      {/* 1. HERO SECTION (NORMALIZED) */}
      <section className='relative min-h-[70vh] flex items-center pt-32 pb-16 overflow-hidden'>
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 blur-[120px] rounded-full translate-x-1/4 animate-glow"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-orange-500/5 blur-[100px] rounded-full -translate-x-1/4"></div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
            {/* Left Content */}
            <div className='space-y-12' data-aos="fade-right">
              <div className="inline-flex items-center gap-3 bg-orange-50 px-5 py-2 rounded-2xl border border-orange-100/50 shadow-sm">
                <Zap size={16} className="text-orange-600 fill-orange-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">The Ultimate Choice for Foodies</span>
              </div>

              <div className='space-y-4'>
                <h1 className='text-3xl md:text-6xl font-black text-gray-950 leading-tight tracking-tight'>
                  Satisfy Your <br />
                  <span className="text-orange-500 italic">Cravings</span> In <br />
                  Real Time.
                </h1>
                <p className='text-gray-500 text-sm md:text-lg font-medium leading-relaxed max-w-xl'>
                  Experience a culinary revolution with FoodHub. Fresh, chef-prepared meals delivered with precision to your doorstep.
                </p>
              </div>

              <div className='flex flex-row items-center gap-4'>
                <Link href='/meals'>
                  <Button className='h-12 px-6 rounded-xl text-md font-medium bg-gray-950 hover:bg-orange-500 shadow-lg transition-all active:scale-95 group'>
                    Explore Menu
                    <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-3 rounded-2xl transition-colors">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-orange-600 transition-transform">
                    <Play size={16} className="fill-orange-600" />
                  </div>
                  <span className="font-bold text-sm text-gray-600">Watch Story</span>
                </div>
              </div>

              <div className="flex items-center gap-10 pt-6 border-t border-gray-100 w-fit">
                <div>
                  <p className="text-3xl font-black text-gray-900">{homeContent?.hero?.reviewRating || 4.9}/5</p>
                  <div className="flex text-orange-500 gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">{homeContent?.hero?.reviewCountLabel || 'Real user reviews'}</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{homeContent?.hero?.avgDeliveryTime || '20min'}</p>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 leading-none">Average</p>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Delivery Time</p>
                </div>
              </div>
            </div>

            {/* Right Visuals */}
            <div className='relative hidden lg:block' data-aos="fade-left">
              <div className="relative z-10 w-full h-[700px] flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-b from-orange-500/10 to-transparent rounded-[100px] transform rotate-3"></div>
                <div className="relative animate-float">
                  <Image
                    src={homeContent?.hero?.image || "/pizza.avif"}
                    width={600}
                    height={600}
                    alt="Pizza Hero"
                    className="rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] object-cover h-[500px] w-[500px]"
                  />
                  <div className="absolute top-10 -right-12 bg-white p-6 rounded-[32px] shadow-3xl border border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-500 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-400">Status</p>
                        <p className="text-sm font-bold text-gray-900">High Quality</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -left-12 bg-gray-950 p-6 rounded-[32px] shadow-3xl text-white">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black">{homeContent?.hero?.trustScore || 4.8}</div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">Global Customer</p>
                        <p className="font-bold">Trust Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-100 rounded-full opacity-50 scale-75"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-500/20 rounded-full opacity-30 scale-100"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsSection />

      {/* 3. CATEGORIES SECTION */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 text-center md:text-left" data-aos="fade-up">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em]">Browse Our Menu</p>
              <h2 className='text-5xl md:text-6xl font-black text-gray-950 tracking-tight'>What are you <br /> <span className="italic">looking for?</span></h2>
            </div>
            <Link href="/meals" className="flex items-center gap-3 text-sm font-black text-gray-400 hover:text-gray-950 transition-colors uppercase tracking-widest group">
              View All Categories <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10'>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-48 bg-white rounded-[40px] animate-pulse shadow-sm'></div>
              ))
            ) : categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/meals?categoryId=${cat.id}`}
                className='group bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[180px]'
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                    Category
                  </span>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-2">
                  <h4 className='font-black text-gray-900 group-hover:text-orange-500 transition-colors tracking-tight text-lg'>
                    {cat.name}
                  </h4>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {(cat as any)._count?.meals || 0} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className='py-32 bg-white'>
        <div className='container mx-auto px-4'>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-24" data-aos="fade-up">
            <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em]">Process</p>
            <h2 className='text-5xl md:text-6xl font-black text-gray-950 tracking-tight'>Simplest Way to <span className="italic">Order</span></h2>
            <p className='text-sm md:text-base text-gray-500 font-medium max-w-xl mx-auto'>
              A smooth 3-step flow powered by live platform data.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative'>
            <div className="absolute top-11 left-0 w-full h-px bg-linear-to-r from-transparent via-orange-200 to-transparent hidden md:block -z-10"></div>
            {(homeContent?.processSteps || [
              { title: 'Choice', desc: 'Pick your perfect meal from local chefs.' },
              { title: 'Order', desc: 'Pay securely and get real-time updates.' },
              { title: 'Enjoy', desc: 'Fresh food delivered exactly on time.' },
            ]).map((step, i) => (
              <div key={i} className='bg-white p-7 rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 text-center relative group' data-aos="fade-up" data-aos-delay={i * 200}>
                <div className="w-11 h-11 mx-auto mb-4 bg-gray-950 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg group-hover:bg-orange-500 transition-colors uppercase">{`0${i + 1}`}</div>
                <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  {i === 0 ? <Search className='text-orange-500' size={24} /> : i === 1 ? <Clock className='text-orange-500' size={24} /> : <Utensils size={24} className='text-orange-500' />}
                </div>
                <h4 className='text-xl font-black mb-2 group-hover:text-orange-500 transition-colors tracking-tight'>{step.title}</h4>
                <p className='text-gray-500 text-sm font-medium leading-relaxed'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OFFERS SECTION */}
      <TrendingOffers />

      {/* 6. FEATURED MEALS (Dynamic Content) */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12" data-aos="fade-up">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-orange-500 tracking-widest">Chef&apos;s Specials</p>
              <h2 className='text-3xl md:text-4xl font-black text-gray-950 tracking-tight'>Today&apos;s Top Picks</h2>
            </div>
            <Link href="/meals">
              <Button variant="outline" className="h-11 rounded-xl border-gray-200 text-gray-600 font-bold px-6 group flex items-center gap-2">
                Browse More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {isLoading && featuredMeals.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-[450px] bg-white rounded-[48px] animate-pulse shadow-sm'></div>
              ))
              : featuredMeals.map((meal, i) => (
                <div key={meal.id} data-aos="fade-up" data-aos-delay={i * 150}>
                  <MealCard meal={meal} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND STORY */}
      <section className='py-32 bg-white overflow-hidden'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-24 items-center'>
            <div className='relative group' data-aos="fade-right">
              <div className="absolute inset-0 bg-orange-500/20 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={homeContent?.story?.image || "/shop.jpeg"}
                className='rounded-[60px] shadow-3xl relative z-10 transition-all duration-1000 group-hover:scale-[1.02]'
                alt='Brand Story'
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[48px] shadow-3xl z-20 border border-gray-50 hidden md:block">
                <p className="text-5xl font-black text-orange-500 mb-1">{homeContent?.story?.yearsOfTrust || 12}+</p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Years of Trust</p>
              </div>
            </div>
            <div className='space-y-10' data-aos="fade-left">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em]">Our Legacy</p>
                <h2 className='text-5xl md:text-7xl font-black text-gray-950 leading-[0.95] tracking-tight'>
                  {homeContent?.story?.title || 'Connecting People through Plate & Palette.'}
                </h2>
              </div>
              <p className='text-gray-500 text-xl leading-relaxed font-medium'>
                {homeContent?.story?.description || "What started as a small kitchen project is now a global movement. We're on a mission to bring high-quality, chef-crafted meals to every household while empowering local talent to shine."}
              </p>
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-2xl font-black text-gray-900">
                    {publicStats
                      ? publicStats.customers >= 1000
                        ? `${(publicStats.customers / 1000).toFixed(1)}K+`
                        : `${publicStats.customers}`
                      : homeContent?.story?.activeEatersValue || '0'}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{homeContent?.story?.activeEatersLabel || 'Active Eaters'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-gray-900">
                    {publicStats ? `${publicStats.radius}` : homeContent?.story?.globalCitiesValue || '0'}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{homeContent?.story?.globalCitiesLabel || 'Global Cities'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MOBILE APP */}
      <section className='py-32 bg-gray-950 text-white rounded-4xl mx-4 mb-32 relative overflow-hidden'>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/10 blur-[150px] rounded-full translate-x-1/2"></div>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-center lg:text-left'>
            <div className='space-y-12' data-aos="fade-right">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em]">Seamless Experience</p>
                <h2 className='text-4xl md:text-5xl font-black leading-tight tracking-tight'>The Hub in <br /> Your <span className="text-orange-500">Pocket.</span></h2>
                <p className='text-gray-400 text-lg font-medium max-w-xl mx-auto lg:mx-0'>
                  Unlock exclusive deals and speed up your order by 40% with the FoodHub Mobile App.
                </p>
              </div>

              <ul className="space-y-4 inline-block text-left">
                {(homeContent?.mobileApp?.features || [
                  'Faster ordering process',
                  'Exclusive app-only discounts',
                  'Personalized recommendations',
                  'Real-time order tracking'
                ]).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-300">
                    <CheckCircle2 size={20} className="text-orange-500" /> {item}
                  </li>
                ))}
              </ul>

              <div className='flex flex-wrap justify-center lg:justify-start gap-6'>
                <Button className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white transition-all font-black text-sm uppercase gap-4 group">
                  <Smartphone size={20} className="group-hover:scale-110 transition-transform" /> App Store
                </Button>
                <Button className="h-16 px-10 rounded-2xl border border-white/20 hover:border-orange-500 bg-transparent text-white hover:bg-orange-500 hover:text-white transition-all font-black text-sm uppercase gap-4">
                  <Search size={20} /> Play Store
                </Button>
              </div>
            </div>
            <div className="relative group" data-aos="fade-left">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <img
                src={homeContent?.mobileApp?.image || "/phone_web.jpeg"}
                className='max-w-full mx-auto relative z-10 translate-y-10 group-hover:translate-y-0 transition-transform duration-1000'
                alt='Mobile App'
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. CREATE ACCOUNT CTA (NEW) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer CTA */}
            <div className="relative p-10 bg-orange-50 rounded-3xl overflow-hidden group border border-orange-100/50" data-aos="fade-right">
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black text-gray-900 leading-tight">Hungry? <br /> Start Eating.</h3>
                <p className="text-gray-600 font-medium">Create a customer account to unlock personalized recommendations and 25% off your first order.</p>
                <Link href={user ? (user.role === 'CUSTOMER' ? '/dashboard/customer' : '/dashboard/user') : "/register?role=CUSTOMER"}>
                  <Button className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold group">
                    {user ? 'Go to Dashboard' : 'Join as Customer'} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Provider CTA */}
            <div className="relative p-10 bg-gray-950 rounded-3xl overflow-hidden group shadow-2xl" data-aos="fade-left">
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black text-white leading-tight">Cooking? <br /> Start Selling.</h3>
                <p className="text-gray-400 font-medium">Join our network of elite chefs. List your kitchen and reach thousands of hungry souls today.</p>
                <Link href={user ? (user.role === 'PROVIDER' ? '/provider/dashboard' : '/dashboard/user') : "/register?role=PROVIDER"}>
                  <Button className="h-12 px-8 rounded-xl bg-white text-gray-950 hover:bg-orange-500 hover:text-white font-bold group">
                    {user ? 'Open Workspace' : 'Become a Provider'} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <Testimonials />

      {/* 10. FAQ & NEWSLETTER */}
      <FAQ />

      <section className="pb-32 container mx-auto px-4" data-aos="zoom-in">
        <div className="bg-gray-50 rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center border border-gray-100">
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl border border-gray-100 shadow-sm mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Subscribe</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">Never Miss a <br />Delicious Update</h2>
            <p className="text-gray-500 text-lg font-medium">Get 20% off on your first order when you join our VIP foodie list.</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white border-2 border-transparent focus:border-orange-500 rounded-[2rem] px-8 py-5 outline-none font-bold text-gray-900 shadow-xl shadow-gray-200/50 transition-all"
              />
              <Button
                onClick={handleNewsletterSubmit}
                disabled={newsletterLoading}
                className="h-auto py-5 px-12 rounded-[2rem] bg-gray-950 hover:bg-orange-500 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-gray-200/50"
              >
                {newsletterLoading ? 'Submitting...' : 'Notify Me'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
