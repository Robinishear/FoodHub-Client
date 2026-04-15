'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/paymentService';
import { CheckCircle2, CreditCard } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

declare global {
  interface Window {
    Stripe?: any;
  }
}

export default function CheckoutPaymentPage() {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <CheckoutPaymentContent />
    </ProtectedRoute>
  );
}

function CheckoutPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId') || '';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const [ready, setReady] = useState(false);
  const [cardMounted, setCardMounted] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [formError, setFormError] = useState('');

  const stripeRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orderId) {
      toast.error('Missing order ID');
      router.push('/checkout');
      return;
    }

    const initIntent = async () => {
      setLoading(true);
      try {
        const [intent, config] = await Promise.all([
          paymentService.createIntent(orderId),
          paymentService.getConfig(),
        ]);
        if (!intent.clientSecret) throw new Error('Stripe client secret missing');
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || config.publishableKey || '';
        if (!key) throw new Error('Stripe publishable key is not configured');
        if (!key.startsWith('pk_')) throw new Error('Invalid Stripe publishable key format');
        setPublishableKey(key);
        setClientSecret(intent.clientSecret);
        setPaymentIntentId(intent.paymentIntentId);
        setFormError('');
      } catch (error: any) {
        const message = error?.message || error?.response?.data?.message || 'Unable to initialize payment';
        setFormError(message);
        toast.error(message);
        router.push('/checkout');
      } finally {
        setLoading(false);
      }
    };
    initIntent();
  }, [orderId, router]);

  useEffect(() => {
    if (!clientSecret || !ready || !window.Stripe || !mountRef.current) return;
    if (cardRef.current) return;

    try {
      stripeRef.current = window.Stripe(publishableKey);
      if (!stripeRef.current) {
        throw new Error('Stripe failed to initialize. Check publishable key.');
      }
      const elements = stripeRef.current.elements();
      cardRef.current = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#111827',
            '::placeholder': { color: '#9CA3AF' },
          },
        },
      });
      cardRef.current.on('change', (event: any) => {
        setCardComplete(!!event.complete);
        if (event.error?.message) {
          setFormError(event.error.message);
        } else {
          setFormError('');
        }
      });
      cardRef.current.mount(mountRef.current);
      setCardMounted(true);
      setFormError('');
    } catch (error: any) {
      setFormError(error?.message || 'Failed to mount payment form');
      toast.error(error?.message || 'Failed to mount payment form');
    }
  }, [clientSecret, ready, publishableKey]);

  const handleConfirm = async () => {
    if (!stripeRef.current || !cardRef.current || !clientSecret || !cardMounted) {
      toast.error('Payment form is not ready');
      return;
    }
    setSubmitting(true);
    try {
      const result = await stripeRef.current.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardRef.current,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }
      if (!result.paymentIntent) {
        throw new Error('No payment intent returned');
      }

      await paymentService.syncStatus(orderId, paymentIntentId || result.paymentIntent.id);
      clearCart();
      toast.success('Payment confirmed successfully');
      router.push('/orders/success');
    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.message || 'Payment confirmation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullPageLoader transparent message='Preparing secure payment...' />;

  return (
    <div className='container mx-auto px-4 pt-32 pb-16 max-w-2xl'>
      <Script
        src='https://js.stripe.com/v3/'
        strategy='afterInteractive'
        onLoad={() => setReady(true)}
        onError={() => setFormError('Failed to load Stripe script')}
      />
      <div className='bg-white rounded-2xl border border-gray-100 shadow-lg p-8 space-y-6'>
        <div className='flex items-center gap-3'>
          <CreditCard className='text-orange-500' />
          <h1 className='text-2xl font-bold'>Stripe Card Payment</h1>
        </div>
        <p className='text-sm text-gray-500'>Enter your card details to confirm this order.</p>
        <p className='text-xs font-semibold text-gray-400'>
          Test mode: use card `4242 4242 4242 4242`, any future date, any CVC.
        </p>

        <div className='border rounded-md px-4 py-3 min-h-[50px] bg-white'>
          <div ref={mountRef} />
        </div>
        {formError && <p className='text-sm font-semibold text-red-500'>{formError}</p>}

        <Button
          className='w-full h-12 font-bold'
          onClick={handleConfirm}
          isLoading={submitting}
          disabled={!cardMounted || !cardComplete || !!formError}
        >
          <CheckCircle2 className='mr-2' size={18} /> Confirm Payment
        </Button>
        <Link href='/checkout' className='block text-center text-sm font-semibold text-gray-500 hover:text-gray-900'>
          Back to checkout
        </Link>
      </div>
    </div>
  );
}
