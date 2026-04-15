import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Once you sign in, browse the menu, add items to your cart, and proceed to checkout by providing your delivery address.',
  },
  {
    question: 'What are the delivery charges?',
    answer: 'Delivery charges vary based on the distance from the restaurant to your location. Some restaurants offer free delivery for orders above a certain amount.',
  },
  {
    question: 'Can I track my order in real-time?',
    answer: 'Yes! After placing an order, you can go to your "My Orders" section to see the real-time status and tracking of your food.',
  },
  {
    question: 'How can I join as a food provider?',
    answer: 'Click on the "Join as Provider" button in the footer or navigation, fill out the registration form, and our team will review your application.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-gray-600 font-medium">Everything you need to know about FoodHub.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                className={`w-full flex items-center justify-between p-6 text-left font-bold text-lg ${openIndex === index ? 'bg-orange-50 text-orange-600' : 'bg-white text-gray-900 hover:bg-gray-50 animate-out'}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              {openIndex === index && (
                <div className="p-6 bg-orange-50/30 text-gray-600 leading-relaxed animate-in slide-in-from-top-2">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
