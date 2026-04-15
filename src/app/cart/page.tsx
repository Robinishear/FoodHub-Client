"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { metaService } from "@/services/metaService";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "react-hot-toast";

export default function CartPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <CartPageContent />
    </ProtectedRoute>
  );
}

function CartPageContent() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart, totalItems } = useCart();
  const [offerCode, setOfferCode] = useState("");
  const [applyingOffer, setApplyingOffer] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<{
    code: string;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);

  const handleApplyOffer = async () => {
    const code = offerCode.trim().toUpperCase();
    if (!code) {
      toast.error("Enter a coupon code first");
      return;
    }
    setApplyingOffer(true);
    try {
      const result = await metaService.validateOfferCode(code, totalPrice);
      setAppliedOffer({
        code: result.code,
        discountAmount: result.discountAmount,
        finalTotal: result.finalTotal,
      });
      toast.success(`Coupon ${result.code} applied`);
    } catch (error: any) {
      setAppliedOffer(null);
      toast.error(error?.response?.data?.message || "Invalid coupon code");
    } finally {
      setApplyingOffer(false);
    }
  };

  const payableTotal = appliedOffer ? appliedOffer.finalTotal : totalPrice;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 max-w-md">Looks like you haven&apos;t added anything to your cart yet. Explore our menu and find something delicious!</p>
        <Link href="/meals">
          <Button size="lg" className="rounded-md">Browse Meals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="mb-10">
        <Link href="/meals" className="text-orange-500 font-bold flex items-center hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={18} className="mr-2" /> Continue Browsing
        </Link>
        <h1 className="text-5xl font-black text-gray-900 mt-4">My Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-center space-x-6">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1760&auto=format&fit=crop"}
                  className="h-24 w-24 rounded-md object-cover shrink-0"
                  alt={item.title}
                />
                <div className="grow space-y-1">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
                    {item.provider?.user?.name || "Provider"}
                  </p>
                  <p className="text-orange-500 font-black">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-md border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-orange-500 transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-orange-500 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right pl-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="h-10 w-10 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-6">
          <Card className="shadow-xl border-gray-100 p-8 rounded-md sticky top-24">
            <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
              <CreditCard size={24} className="mr-3 text-orange-500" />
              Order Summary
            </h3>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Items ({totalItems})</span>
                <span className="text-gray-950 font-bold">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Delivery Fee</span>
                <span className="text-green-400 font-bold font-mono">FREE</span>
              </div>
              {appliedOffer && (
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Discount ({appliedOffer.code})</span>
                  <span className="text-green-500 font-bold">-{formatCurrency(appliedOffer.discountAmount)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Total Amount</span>
                  <span className="text-3xl font-black text-orange-500">
                    {formatCurrency(payableTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Coupon Code</p>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter code"
                    className="flex-1 h-11 rounded-md border border-gray-200 px-3 text-sm font-semibold uppercase"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={handleApplyOffer}
                    isLoading={applyingOffer}
                  >
                    Apply
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 rounded-md font-bold"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Link href={appliedOffer ? `/checkout?offerCode=${encodeURIComponent(appliedOffer.code)}` : "/checkout"}>
                <Button
                  className="w-full h-14 rounded-md text-lg flex items-center justify-center font-black"
                >
                  Proceed to Checkout <Plus size={20} className="ml-2 rotate-45" />
                </Button>
              </Link>

              <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
                Almost there! Next step: Review & Pay
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
