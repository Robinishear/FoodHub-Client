"use client";

import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white rounded-t-2xl mt-12 pt-12 pb-6 overflow-hidden relative">
      <div className="container mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap size={16} fill="currentColor" />
              </div>
              <span className="text-xl font-bold tracking-tight">Food<span className="text-orange-500">Hub</span></span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Fresh food from best local restaurants delivered to your doorstep. Fast, fresh, and every time.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://x.com" },
                { Icon: Youtube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <Link key={i} target="_blank" rel="noreferrer" href={href} className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all">
                   <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Links</h4>
            <nav className="flex flex-col space-y-2">
              {[
                { label: "Explore Menu", href: "/meals" },
                { label: "Our Restaurants", href: "/providers" },
                { label: "Offers", href: "/offers" },
                { label: "Blog", href: "/blog" },
              ].map(item => (
                <Link key={item.label} href={item.href} className="text-gray-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-1 group">
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" /> {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Company</h4>
            <nav className="flex flex-col space-y-2 text-gray-400 text-xs font-medium">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500">Contact</h4>
            <div className="space-y-3">
              <div className="flex gap-2 items-start text-xs">
                <MapPin className="text-orange-500 shrink-0" size={14} />
                <p className="text-gray-400">123 Food Street, NY 10001</p>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <Phone className="text-orange-500 shrink-0" size={14} />
                <p className="text-gray-400">+1 (800) FOOD-HUB</p>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <Mail className="text-orange-500 shrink-0" size={14} />
                <p className="text-gray-400">hello@foodhub.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] text-gray-500">© 2026 FoodHub Inc. All Rights Reserved.</p>
          <div className="flex gap-4 text-[10px] text-gray-500">
             <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
             <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
             <Link href="/cookies" className="hover:text-orange-500 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
