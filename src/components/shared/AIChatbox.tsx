"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: 'ai',
      content: "Hello! I'm your FoodHub AI assistant. How can I help you find the perfect meal today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || 'AI request failed');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: payload.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: error?.message || 'I could not connect to the AI service right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-6 w-[325px] h-[500px] bg-white rounded-[2.5rem] shadow-4xl border border-gray-100 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-6 bg-gray-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white border-2 border-white/20 shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">FoodHub Assistant</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Systems Active
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Minimize2 size={18} />
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50"
            >
              {messages.map((m) => (
                <div key={m.id} className={cn(
                  "flex items-start gap-3",
                  m.role === 'user' ? "flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs shadow-sm",
                    m.role === 'ai' ? "bg-orange-500 text-white" : "bg-gray-950 text-white"
                  )}>
                    {m.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm",
                    m.role === 'ai'
                      ? "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      : "bg-orange-500 text-white rounded-tr-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="bg-orange-500 text-white h-8 w-8 rounded-lg flex items-center justify-center shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                    <Loader2 className="animate-spin text-orange-500" size={16} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thinking</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-2 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about recommendations..."
                  className="w-full pl-4 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:ring-4 ring-orange-500/5 outline-none transition-all"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-gray-950 hover:bg-orange-500 rounded-xl flex items-center justify-center p-0 transition-all"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-12 w-12 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group relative",
          isOpen ? "bg-gray-950" : "bg-orange-500 shadow-orange-500/30"
        )}
      >
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600"></span>
          </span>
        )}
      </Button>
    </div>
  );
}
