'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import { metaService } from '@/services/metaService';
import { paymentService } from '@/services/paymentService';
import { ArrowLeft, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}

function CheckoutPageContent() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [address, setAddress] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [applyingOffer, setApplyingOffer] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<{
    code: string;
    discountAmount: number;
    finalTotal: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE'>('COD');

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/meals');
    }
  }, [cart, router]);

  useEffect(() => {
    const code = searchParams.get('offerCode');
    if (!code || cart.length === 0) return;

    const applyFromQuery = async () => {
      try {
        const result = await metaService.validateOfferCode(code, totalPrice);
        setOfferCode(result.code);
        setAppliedOffer({
          code: result.code,
          discountAmount: result.discountAmount,
          finalTotal: result.finalTotal,
        });
      } catch {
        setAppliedOffer(null);
      }
    };
    applyFromQuery();
  }, [searchParams, totalPrice, cart.length]);

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!user) {
      toast.error('Authentication required. Please login.');
      router.push('/login');
      return;
    }

    if (!address.trim() || address.length < 10) {
      toast.error('Please provide a complete delivery address (min 10 chars).');
      return;
    }

    setIsLoading(true);

    try {
      // Map cart items to the format expected by the API
      const items = cart.map((item) => ({
        mealId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // Use our centralized order service for the API call
      const created = await orderService.createOrder({
        address: address.trim(),
        items: items, // Backend expects 'items' field
        offerCode: appliedOffer?.code,
      });

      if (paymentMethod === 'STRIPE') {
        const orderId = created?.data?.id;
        if (!orderId) {
          throw new Error('Order ID missing for payment');
        }
        const session = await paymentService.createCheckoutSession(orderId);
        if (!session?.url) {
          throw new Error('Stripe checkout URL not found');
        }
        window.location.href = session.url;
        return;
      }

      toast.success('Hooray! Your order has been placed.');
      clearCart();
      router.push('/orders/success');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Checkout process failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Something went wrong during checkout. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOffer = async () => {
    const code = offerCode.trim().toUpperCase();
    if (!code) {
      toast.error('Enter an offer code first');
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
      toast.success(`Offer ${result.code} applied`);
    } catch (error: any) {
      setAppliedOffer(null);
      toast.error(error?.response?.data?.message || 'Invalid offer code');
    } finally {
      setApplyingOffer(false);
    }
  };

  const payableTotal = appliedOffer ? appliedOffer.finalTotal : totalPrice;

  return (
    <div className='container mx-auto px-4 pt-32 pb-16 max-w-6xl'>
      {isLoading && (
        <FullPageLoader message='Placing your order...' transparent />
      )}
      <div className='mb-12'>
        <Link
          href='/cart'
          className='text-orange-500 font-bold flex items-center group'
        >
          <ArrowLeft size={18} className='mr-2' /> Back to Cart
        </Link>
        <h1 className='text-4xl font-bold text-gray-900 mt-4'>
          Finalize Order
        </h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
        {/* Left Side: Forms */}
        <div className='space-y-8'>
          <div className='bg-white p-8 rounded-md shadow-lg border border-gray-100 space-y-6'>
            <div className='flex items-center space-x-4'>
              <div className='h-12 w-12 bg-orange-50 rounded-md flex items-center justify-center text-orange-500'>
                <MapPin size={24} />
              </div>
              <h2 className='text-xl font-bold'>Delivery Details</h2>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Full Shipping Address
              </label>
              <textarea
                placeholder='Street name, House #, Apartment, City...'
                className='w-full bg-gray-50 border border-gray-100 rounded-md p-4 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none min-h-[120px] resize-none transition-all'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className='text-xs text-gray-500'>
                We currently only deliver within the city metropolitan area.
              </p>
            </div>
          </div>

          <div className='bg-white p-8 rounded-md shadow-lg border border-gray-100 space-y-6'>
            <div className='flex items-center space-x-4'>
              <div className='h-12 w-12 bg-orange-50 rounded-md flex items-center justify-center text-orange-500'>
                <CreditCard size={24} />
              </div>
              <h2 className='text-xl font-bold'>Payment Method</h2>
            </div>
            <div className='space-y-3'>
              <button
                type='button'
                onClick={() => setPaymentMethod('COD')}
                className={`w-full p-4 rounded-md border flex items-center justify-between ${paymentMethod === 'COD' ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className='flex items-center space-x-4'>
                  <div className={`h-4 w-4 rounded-full ${paymentMethod === 'COD' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <span className='font-bold text-gray-900'>
                    Cash on Delivery
                  </span>
                </div>
                <span className='text-xs font-bold text-orange-500 uppercase tracking-wider'>
                  COD
                </span>
              </button>
              <button
                type='button'
                onClick={() => setPaymentMethod('STRIPE')}
                className={`w-full p-4 rounded-md border flex items-center justify-between ${paymentMethod === 'STRIPE' ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className='flex items-center space-x-4'>
                  <div className={`h-4 w-4 rounded-full ${paymentMethod === 'STRIPE' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <span className='font-bold text-gray-900'>
                    Pay with Card (Stripe)
                  </span>
                </div>
                <span className='text-xs font-bold text-orange-500 uppercase tracking-wider'>
                  CARD
                </span>
              </button>
            </div>
          </div>

          <div className='bg-white p-8 rounded-md shadow-lg border border-gray-100 space-y-4'>
            <h2 className='text-xl font-bold'>Coupon / Offer</h2>
            <div className='flex gap-2'>
              <input
                placeholder='Enter offer code (e.g. SAVE20)'
                className='flex-1 h-11 rounded-md border border-gray-200 px-3 text-sm font-semibold uppercase'
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
              />
              <Button
                variant='outline'
                onClick={handleApplyOffer}
                isLoading={applyingOffer}
                className='h-11'
              >
                Apply
              </Button>
            </div>
            {appliedOffer && (
              <p className='text-sm font-bold text-green-600'>
                {appliedOffer.code} applied, you saved{' '}
                {formatCurrency(appliedOffer.discountAmount)}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Summary */}
        <aside>
          <div className='sticky top-24'>
            <Card className='shadow-xl border-gray-100 p-8 rounded-md bg-white space-y-8'>
              <h3 className='text-xl font-bold'>Review Order</h3>

              <div className='space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6'>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='h-12 w-12 rounded-lg overflow-hidden shrink-0'>
                        <img
                          src={item.image}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 text-sm'>
                          {item.title}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {item.quantity} units
                        </p>
                      </div>
                    </div>
                    <span className='font-bold text-gray-900 text-sm'>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className='space-y-3 pt-6 border-t border-gray-100'>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Subtotal</span>
                  <span className='font-bold'>
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-gray-600'>
                  <span>Delivery</span>
                  <span className='text-green-600 font-bold'>FREE</span>
                </div>
                {appliedOffer && (
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Discount ({appliedOffer.code})</span>
                    <span className='text-green-600 font-bold'>
                      -{formatCurrency(appliedOffer.discountAmount)}
                    </span>
                  </div>
                )}
                <div className='flex justify-between items-end pt-4'>
                  <div className='flex flex-col'>
                    <span className='text-xs text-gray-400 font-bold uppercase tracking-wider mb-1'>
                      Total Amount
                    </span>
                    <span className='text-3xl font-black text-orange-500'>
                      {formatCurrency(payableTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className='w-full h-14 rounded-md text-lg font-bold shadow-lg shadow-orange-500/20'
                onClick={handlePlaceOrder}
                isLoading={isLoading}
              >
                {paymentMethod === 'STRIPE' ? 'Continue to Card Payment' : 'Place Secure Order'}
              </Button>
            </Card>

            <div className='mt-8 flex items-center justify-center space-x-2 text-gray-400'>
              <ShieldCheck size={16} />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Satisfaction Guaranteed
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
