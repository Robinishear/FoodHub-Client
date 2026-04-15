/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MealCard } from '@/components/meals/MealCard';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mealService } from '@/services/mealService';
import { Category, Meal } from '@/types';
import { Search, SlidersHorizontal, Utensils, SortAsc, Star, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { Suspense } from 'react';

function MealsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('categoryId') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const nextSearch = searchParams.get('search') || '';
    const nextCategory = searchParams.get('categoryId') || '';
    setSearchTerm(nextSearch);
    setSelectedCat(nextCategory);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await mealService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const params: any = {
          limit: itemsPerPage,
          page: page
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCat) params.categoryId = selectedCat;
        if (sortBy) params.sortBy = sortBy === 'newest' ? 'createdAt' : sortBy === 'price-low' ? 'price' : 'rating'; // Map frontend keys to backend columns

        const response = await mealService.getMeals(params);
        setMeals(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.total);
      } catch (error) {
        console.error('Failed to load meals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();

  }, [searchTerm, selectedCat, sortBy, page]);

  const toggleCategory = (id: string) => {
    const newCat = selectedCat === id ? '' : id;
    setSelectedCat(newCat);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (newCat) params.set('categoryId', newCat);
    else params.delete('categoryId');
    router.push(`/meals?${params.toString()}`);
  };

  return (
    <div className='container mx-auto px-4 pt-32 pb-16 min-h-screen'>
      {/* Mobile Filter Toggle Button */}
      <div className='lg:hidden mb-6'>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className='w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-lg transition-all flex items-center justify-center gap-2'
        >
          <SlidersHorizontal size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 space-y-8 shrink-0`}>
          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-8'>
            <div className="flex items-center justify-between">
              <h3 className='text-lg font-bold text-gray-900 flex items-center tracking-tight'>
                <SlidersHorizontal size={18} className='mr-2 text-orange-500' />
                Filters
              </h3>
              {(selectedCat || searchTerm) && (
                 <button 
                   onClick={() => { setSearchTerm(''); setSelectedCat(''); setPage(1); }}
                   className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                 >
                   Reset
                 </button>
              )}
            </div>

            {/* Search */}
            <div className='space-y-3'>
              <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                Search Menu
              </label>
              <div className='relative group'>
                <Input
                  placeholder='Ex: Pizza...'
                  className='h-11 pl-10 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium text-sm'
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                />
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-300' size={16} />
              </div>
            </div>

            {/* Categories */}
            <div className='space-y-3'>
              <label className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                Categories
              </label>
              <div className='space-y-1.5'>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                      selectedCat === cat.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${selectedCat === cat.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                       {cat._count?.meals || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-gray-950 rounded-2xl p-8 text-white space-y-4 relative overflow-hidden group'>
             <div className="relative z-10">
                <h4 className='text-xl font-bold mb-2'>Sell on FoodHub</h4>
                <p className='text-xs text-gray-400 leading-relaxed'>List your kitchen and start reaching customers today.</p>
                <Link href='/become-provider' className='block pt-4'>
                   <Button className='w-full h-10 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs'>Join Now</Button>
                </Link>
             </div>
             <Utensils className="absolute -bottom-4 -right-4 text-white/5" size={100} />
          </div>
        </aside>

        {/* Main Content */}
        <main className='grow space-y-10'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6'>
            <div>
               <h1 className='text-2xl font-bold text-gray-950'>
                {selectedCat ? categories.find((c) => c.id === selectedCat)?.name : 'All Meals'}
               </h1>
               <p className="text-xs text-gray-400 font-medium">Found {totalItems} delicious results</p>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
               {[
                 { id: 'newest', icon: <SortAsc size={14} />, label: 'Newest' },
                 { id: 'price-low', icon: <DollarSign size={14} />, label: 'Price' },
                 { id: 'rating', icon: <Star size={14} />, label: 'Rating' }
               ].map(option => (
                 <button
                   key={option.id}
                   onClick={() => setSortBy(option.id)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                     sortBy === option.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                   }`}
                 >
                   {option.icon} {option.label}
                 </button>
               ))}
            </div>
          </div>

          {loading ? (
             <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                     <div className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
                     <div className="h-4 bg-gray-100 w-2/3 rounded-full animate-pulse"></div>
                     <div className="h-3 bg-gray-100 w-full rounded-full animate-pulse"></div>
                  </div>
                ))}
             </div>
          ) : meals.length > 0 ? (
            <div className='space-y-12'>
               <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                 {meals.map((meal) => (
                   <MealCard key={meal.id} meal={meal} />
                 ))}
               </div>

               {/* Pagination */}
               <div className="flex items-center justify-center gap-2 pt-8">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="rounded-xl"
                  >
                     <ChevronLeft size={18} />
                  </Button>
                  <div className="flex gap-1">
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                        <Button 
                          key={i} 
                          variant={page === i ? 'default' : 'ghost'}
                          onClick={() => setPage(i)}
                          className={`w-10 h-10 rounded-xl font-bold ${page === i ? 'bg-orange-500' : ''}`}
                        >
                           {i}
                        </Button>
                     ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="rounded-xl"
                  >
                     <ChevronRight size={18} />
                  </Button>
               </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-24 text-center space-y-4'>
               <div className='w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300'>
                  <Utensils size={32} />
               </div>
               <h3 className='text-xl font-bold text-gray-900'>No meals found</h3>
               <p className='text-sm text-gray-500 max-w-xs'>Try adjusting your filters to find what you are looking for.</p>
               <Button onClick={() => { setSearchTerm(''); setSelectedCat(''); setPage(1); }} className='h-11 px-8 rounded-xl bg-gray-900'>Clear All</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <MealsContent />
    </Suspense>
  );
}
