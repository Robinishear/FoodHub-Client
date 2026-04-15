"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X, Utensils, ArrowRight, Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mealService } from "@/services/mealService";
import { Meal } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [keywordPool, setKeywordPool] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadSmartKeywords = async () => {
      try {
        const [mealResponse, categories] = await Promise.all([
          mealService.getMeals({ limit: 60 }),
          mealService.getCategories(),
        ]);

        const meals = Array.isArray(mealResponse?.data) ? mealResponse.data : [];
        const pool = new Set<string>();

        meals.forEach((meal: Meal) => {
          if (meal.title) pool.add(meal.title.trim());
          if (meal.description) {
            meal.description
              .split(/\s+/)
              .map((word) => word.replace(/[^\w]/g, "").trim())
              .filter((word) => word.length >= 4)
              .forEach((word) => pool.add(word));
          }
        });

        (Array.isArray(categories) ? categories : []).forEach((cat: { name?: string }) => {
          if (cat?.name) pool.add(cat.name.trim());
        });

        setKeywordPool(Array.from(pool).slice(0, 200));
      } catch {
        setKeywordPool([]);
      }
    };

    loadSmartKeywords();
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setLoading(true);
        try {
          const response = await mealService.getMeals({ search: searchTerm, limit: 5 });
          setResults(response.data);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const smartSuggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const fallback = keywordPool.slice(0, 6);
    if (!q) return fallback;

    const startsWith = keywordPool.filter((item) => item.toLowerCase().startsWith(q));
    const includes = keywordPool.filter(
      (item) => item.toLowerCase().includes(q) && !item.toLowerCase().startsWith(q)
    );

    return [...startsWith, ...includes].slice(0, 6);
  }, [keywordPool, searchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-4xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="p-8 border-b border-gray-100 bg-white sticky top-0 z-10">
               <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={24} />
                  <input 
                    autoFocus
                    placeholder="Search for cravings... (e.g. Pizza, Sushi)"
                    className="w-full pl-16 pr-20 py-6 bg-gray-50 border-none rounded-3xl text-xl font-black text-gray-900 focus:bg-white focus:ring-4 ring-orange-500/5 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     {loading && <Loader2 className="animate-spin text-orange-500" size={20} />}
                     <button onClick={onClose} className="p-2 h-10 w-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                        <X size={18} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
               {results.length > 0 ? (
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] ml-6 mb-4">Discovery Results</p>
                     {results.map((meal) => (
                        <Link 
                          key={meal.id} 
                          href={`/meals/${meal.id}`}
                          onClick={onClose}
                          className="flex items-center gap-6 p-4 rounded-3xl hover:bg-orange-50 group transition-all"
                        >
                           <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                              <Image src={meal.image || '/default-meal.jpg'} width={100} height={100} className="w-full h-full object-cover" alt={meal.title} />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">{meal.title}</h4>
                              <div className="flex items-center gap-4 mt-1">
                                 <span className="text-sm font-black text-orange-500">{formatCurrency(meal.price)}</span>
                                 <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                                    <Star size={10} fill="currentColor" className="mr-1 text-orange-500" /> {meal.averageRating || 4.5}
                                 </div>
                              </div>
                           </div>
                           <ArrowRight className="text-gray-200 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" size={20} />
                        </Link>
                     ))}
                  </div>
               ) : searchTerm.trim().length > 1 && !loading ? (
                  <div className="py-20 text-center space-y-4">
                     <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto"><Utensils size={32} /></div>
                     <p className="text-gray-500 font-bold">No culinary matches for &quot;{searchTerm}&quot;</p>
                     {smartSuggestions.length > 0 && (
                        <div className="pt-4">
                           <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] mb-4">Try these</p>
                           <div className="flex flex-wrap justify-center gap-3">
                              {smartSuggestions.map((tag) => (
                                 <button
                                    key={tag}
                                    onClick={() => setSearchTerm(tag)}
                                    className="px-6 py-2 bg-gray-50 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-black transition-all border border-gray-100"
                                 >
                                    {tag}
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="py-20 text-center space-y-6">
                     <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">Smart Suggestions</p>
                     <div className="flex flex-wrap justify-center gap-3">
                        {smartSuggestions.map(tag => (
                           <button 
                             key={tag}
                             onClick={() => setSearchTerm(tag)}
                             className="px-6 py-2 bg-gray-50 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-black transition-all border border-gray-100"
                           >
                              {tag}
                           </button>
                        ))}
                        {smartSuggestions.length === 0 &&
                          ['Pizza', 'Burger', 'Sushi', 'Vegan', 'Pasta', 'Dessert'].map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSearchTerm(tag)}
                              className="px-6 py-2 bg-gray-50 hover:bg-orange-500 hover:text-white rounded-xl text-sm font-black transition-all border border-gray-100"
                            >
                              {tag}
                            </button>
                          ))}
                     </div>
                  </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
