"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Search, MessageSquare, Phone, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { aiService } from "@/services/aiService";
import { toast } from "react-hot-toast";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");

  const faqs = [
    {
      q: "How fast is the delivery really?",
      a: "Our average delivery time is 25 minutes. We use hyper-local routing and specialized couriers to ensure your food arrives hot and fresh, as if it just left the kitchen."
    },
    {
      q: "What if there is something wrong with my order?",
      a: "We have a 24/7 dedicated support team. You can chat with us instantly through the app or website, and we guarantee a resolution within 15 minutes of reporting."
    },
    {
      q: "Are the food providers verified?",
      a: "Yes, every provider on FoodHub undergoes a strict 5-stage verification process including hygiene inspection, taste tests, and legal compliance checks."
    },
    {
      q: "How can I become a partner?",
      a: "Simply head over to the 'Become a Partner' page and fill out the form. Our onboarding team will contact you within 48 hours for a physical inspection of your kitchen."
    },
    {
      q: "Is there a subscription for free delivery?",
      a: "Yes! FoodHub Gold offers unlimited free delivery on all orders over $15 for just $9.99/month. You also get exclusive access to limited-edition meals."
    }
  ];

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  const handleSearch = () => {
    if (!query.trim()) {
      setOpenIndex(0);
      return;
    }
    const firstIndex = filteredFaqs.length
      ? faqs.findIndex((item) => item.q === filteredFaqs[0].q)
      : null;
    setOpenIndex(firstIndex !== null && firstIndex >= 0 ? firstIndex : null);
  };

  const handleAiHelp = async () => {
    const message = query.trim();
    if (!message) {
      toast.error("Write your question first");
      return;
    }
    setAiLoading(true);
    try {
      const response = await aiService.chat(
        `You are FoodHub Help Center assistant. Give concise support answer for: ${message}`,
      );
      setAiAnswer(response?.data || "No answer available right now.");
    } catch (error: any) {
      setAiAnswer("");
      toast.error(error?.response?.data?.message || "AI help is unavailable now");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Header */}
      <section className="bg-gray-950 pt-32 pb-20 text-white relative overflow-hidden text-center px-4">
        <div className="absolute top-0 left-0 w-full h-full bg-orange-500/5 blur-[120px] rounded-full translate-y-1/2"></div>
        <div className="container mx-auto max-w-4xl relative z-10 space-y-8">
          <div className="space-y-3">
             <p className="text-xs font-bold uppercase text-orange-500 tracking-wider">Help Center</p>
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How can we <span className="text-orange-500">help you today?</span></h1>
          </div>
          <div className="relative group max-w-xl mx-auto">
             <Input 
               placeholder="Search for answers..." 
               className="h-14 pl-12 pr-28 rounded-xl border-none bg-white text-gray-900 font-medium shadow-lg" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <Button
               onClick={handleSearch}
               className="absolute right-1.5 top-1.5 bottom-1.5 bg-gray-950 hover:bg-orange-500 px-6 rounded-lg transition-all h-auto"
             >
                Search
             </Button>
          </div>
          <div className="flex justify-center">
            <Button
              className="h-12 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 transition-all"
              onClick={handleAiHelp}
              isLoading={aiLoading}
            >
              Ask AI Help
            </Button>
          </div>
          {aiAnswer && (
            <div className="max-w-3xl mx-auto text-left p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-xs uppercase tracking-wider text-orange-300 font-bold mb-1">AI Suggestion</p>
              <p className="text-sm text-white/90">{aiAnswer}</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="py-20 container mx-auto px-4 max-w-5xl">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 space-y-8 h-fit lg:sticky lg:top-32">
               <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">General Questions</h2>
                  <p className="text-gray-500 text-sm font-medium">If you can&apos;t find what you&apos;re looking for, our team is ready to help via live chat.</p>
               </div>
               
               <div className="space-y-4">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                     <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><Phone size={20} /></div>
                     <p className="text-lg font-bold text-gray-900">+1 (800) FOOD-HUB</p>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available 24/7</p>
                  </div>
                  <div className="p-6 bg-gray-950 rounded-2xl text-white space-y-3 shadow-lg">
                     <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-500 shadow-sm"><MessageSquare size={20} /></div>
                     <p className="text-lg font-bold text-white">Live Chat</p>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Response in mins</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
               {filteredFaqs.length === 0 && (
                 <Card className="p-6 rounded-2xl border border-gray-100 bg-white">
                   <p className="text-gray-500 font-medium">No match found. Try another keyword or use AI Help.</p>
                 </Card>
               )}
               {filteredFaqs.map((faq, i) => (
                 <Card 
                  key={faq.q}
                   className={`p-6 rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden cursor-pointer ${
                     openIndex === i ? 'bg-orange-50 border-orange-200' : 'bg-white hover:bg-gray-50'
                   }`}
                   onClick={() => setOpenIndex(openIndex === i ? null : i)}
                 >
                    <div className="flex justify-between items-center gap-4">
                       <h4 className="text-lg font-bold text-gray-900">{faq.q}</h4>
                       <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                         openIndex === i ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                       }`}>
                          {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                       </div>
                    </div>
                    {openIndex === i && (
                      <div className="mt-6 pt-6 border-t border-orange-200/50 animate-in fade-in slide-in-from-top-2 duration-300">
                         <p className="text-gray-600 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="pb-20 text-center container mx-auto px-4">
         <Card className="bg-gray-950 p-12 rounded-3xl text-white overflow-hidden relative group">
            <div className="relative z-10 space-y-6">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Still have questions?</h2>
               <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">Get in touch with our team of specialists and we&apos;ll help you find exactly what you need.</p>
               <Button className="h-14 px-8 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-lg transition-all shadow-lg gap-3">
                  Open Support Ticket <Zap size={18} />
               </Button>
            </div>
         </Card>
      </section>
    </div>
  );
}
