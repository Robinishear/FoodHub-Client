"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchModal } from "./SearchModal";
import { mealService } from "@/services/mealService";
import { metaService } from "@/services/metaService";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );
  const [popularCuisines, setPopularCuisines] = useState<{ id: string; name: string }[]>([]);
  const [featuredOffer, setFeaturedOffer] = useState<{ title: string; description: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadMegaMenuData = async () => {
      try {
        const [categories, offers] = await Promise.all([
          mealService.getCategories(),
          metaService.getOffers(),
        ]);
        const cuisineNames = (categories || [])
          .map((cat: { id?: string; name?: string }) => ({ id: cat?.id, name: cat?.name }))
          .filter((cat: { id?: string; name?: string }) => Boolean(cat.id && cat.name))
          .slice(0, 5);
        setPopularCuisines(cuisineNames);
        if (offers?.length) {
          setFeaturedOffer({
            title: offers[0].title,
            description: offers[0].description,
          });
        } else {
          setFeaturedOffer(null);
        }
      } catch {
        setPopularCuisines([]);
        setFeaturedOffer(null);
      }
    };
    loadMegaMenuData();
  }, []);

  type NavLinkItem = {
    name: string;
    href: string;
    hasDropdown?: boolean;
    badge?: string;
    protected?: boolean;
  };

  const navLinks: NavLinkItem[] = [
    { name: "Home", href: "/" },
    {
      name: "Explore",
      href: "/meals",
      hasDropdown: true,
      badge: "HOT"
    },
    { name: "Restaurants", href: "/providers" },
    { name: "Offers", href: "/offers" },
    ...(user?.role !== 'ADMIN' && user?.role !== 'MANAGER' ? [
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
    ] : user?.role === 'MANAGER' ? [
      { name: "FAQ", href: "/faq" },
    ] : []),
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
      isScrolled
        ? "py-2 px-6 md:px-10"
        : "py-3 px-4"
    )}>
      <div className={cn(
        "container mx-auto max-w-7xl transition-all duration-300 rounded-2xl flex items-center justify-between px-6 py-3 border border-transparent",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-white/20"
          : "bg-white border-gray-100 shadow-sm"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative h-14 w-14 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logo.png" 
              alt="FoodHub Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
            Food<span className="text-orange-500">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            const isActive = pathname === link.href;
            return (
              <div
                key={link.name}
                className="relative group/nav"
                onMouseEnter={() => link.hasDropdown && setActiveMegaMenu(link.name)}
                onMouseLeave={() => link.hasDropdown && setActiveMegaMenu(null)}
              >
                <Link href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                      isActive ? "text-orange-500 bg-orange-50" : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
                    )}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-[8px] rounded-md animate-pulse">
                        {link.badge}
                      </span>
                    )}
                    {link.hasDropdown && <ChevronDown size={14} className={cn("transition-transform duration-500", activeMegaMenu === link.name && "rotate-180")} />}
                  </Button>
                </Link>

                {/* Mega Menu Dropdown */}
                {link.hasDropdown && (
                  <div className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 w-[500px] transition-all duration-300 origin-top pt-2",
                    activeMegaMenu === link.name ? "scale-100 opacity-100 translate-y-0 visible" : "scale-95 opacity-0 -translate-y-2 invisible pointer-events-none"
                  )}>
                    <div className="bg-white rounded-[32px] shadow-3xl border border-gray-100 p-8">
                      <div className="grid grid-cols-2 gap-10">
                        <div>
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Popular Cuisines</h4>
                          <div className="space-y-2">
                            {(popularCuisines.length ? popularCuisines : [{ id: "", name: "Cuisine" }]).map((cat) => (
                              <Link
                                key={`${cat.id}-${cat.name}`}
                                href={cat.id ? `/meals?categoryId=${cat.id}` : "/meals"}
                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-orange-500 font-bold text-sm transition-all group"
                              >
                                {cat.name} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-3xl p-6 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-bold text-gray-900 mb-2">{featuredOffer?.title || "Latest Offer"}</p>
                            <p className="text-[10px] text-gray-500 font-medium line-clamp-3">{featuredOffer?.description || "Check available offers from our partner network."}</p>
                          </div>
                          <Link href="/become-provider" className="flex items-center gap-2 text-xs font-bold text-orange-500 hover:text-orange-600 mb-4 transition-colors">
                            Join as Partner <ChevronRight size={14} />
                          </Link>
                          <Link href="/offers">
                            <Button className="w-full h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold">Claim Offer</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 pr-2 border-r border-gray-100">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="h-10 w-10 rounded-xl bg-gray-100 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center text-gray-500"
            >
              <Search size={18} />
            </button>
            <Link href="/cart" className="relative group">
              <div className="h-10 w-10 rounded-xl bg-gray-50 border border-transparent group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-transparent hover:border-gray-100 transition-all group cursor-pointer relative">
                <Link
                  href={
                    user.role === "ADMIN"
                      ? "/admin/dashboard"
                      : user.role === "PROVIDER"
                        ? "/provider/dashboard"
                        : user.role === "MANAGER"
                          ? "/dashboard/manager"
                          : user.role === "ORGANIZER"
                            ? "/dashboard/organizer"
                            : user.role === "CUSTOMER"
                              ? "/dashboard/customer"
                              : "/dashboard/customer"
                  }
                  className="flex items-center gap-3"
                >
                  <div className="h-10 w-10 bg-gray-950 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xl group-hover:rotate-6 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Authenticated</p>
                    <p className="text-xs font-black text-gray-900">{user.name.split(' ')[0]}</p>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 ml-2">
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-gray-500">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-2xl bg-gray-950 hover:bg-orange-500 text-white px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-200 transition-all active:scale-95">Join Now</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-32 z-40 bg-white p-2 animate-in fade-in slide-in-from-top-10 duration-700 overflow-y-auto pb-20">
          <div className="grid grid-cols-1 gap-4">
            <p className="text-sm font-medium uppercase text-gray-300 tracking-[0.4em] mb-4">Navigational Map</p>
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-2xl font-medium text-lg text-gray-900 group active:bg-orange-500 active:text-white transition-all"
                >
                  {link.name}
                  <ChevronRight className="text-gray-200 group-hover:text-orange-500" />
                </Link>
              )
            })}
            {user && (
              <Button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full h-10 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-medium text-lg gap-4">
                <LogOut size={24} /> Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
