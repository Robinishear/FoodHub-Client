'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/services/aiService';
import { toast } from 'react-hot-toast';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! I am your FoodHub assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiService.chat(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: response.data }]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'AI is currently resting. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '60px' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={24} className="bg-white/20 p-1 rounded-lg" />
                <span className="font-bold">FoodHub AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded-md transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-orange-500 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                      }`}>
                        <div className="flex items-center gap-1 mb-1 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                          {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me something..."
                    className="flex-1 text-sm bg-gray-100 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    disabled={isLoading || !input.trim()}
                    className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 group overflow-hidden"
        >
          <MessageSquare size={24} />
          <span className="max-w-0 group-hover:max-w-[100px] transition-all duration-300 ease-in-out font-bold overflow-hidden whitespace-nowrap">
            FoodHub AI
          </span>
        </motion.button>
      )}
    </div>
  );
}
