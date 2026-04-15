'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { adminService } from '@/services/adminService';
import { Copy, Percent, Plus, Tag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

type OfferItem = {
  id: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
};

type OfferFormState = {
  title: string;
  description: string;
  tag: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: string;
  minOrderAmount: string;
  usageLimit: string;
};

const initialForm: OfferFormState = {
  title: '',
  description: '',
  tag: 'LIMITED',
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderAmount: '0',
  usageLimit: '',
};

export default function AdminOffersPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminOffersContent />
    </ProtectedRoute>
  );
}

function AdminOffersContent() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<OfferFormState>(initialForm);

  const activeCount = useMemo(() => offers.filter((o) => o.isActive).length, [offers]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await adminService.offers.getAll();
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load offers');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.code.trim()) {
      toast.error('Title, description, and code are required');
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      await adminService.offers.create({
        title: form.title.trim(),
        description: form.description.trim(),
        tag: form.tag.trim() || 'LIMITED',
        color: 'bg-orange-500',
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount || '0'),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        isActive: true,
      });
      toast.success('Offer created');
      setForm(initialForm);
      fetchOffers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create offer');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (offer: OfferItem) => {
    try {
      await adminService.offers.update(offer.id, { isActive: !offer.isActive });
      toast.success(`Offer ${offer.isActive ? 'hidden' : 'activated'}`);
      fetchOffers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this offer permanently?')) return;
    try {
      await adminService.offers.delete(id);
      toast.success('Offer deleted');
      fetchOffers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete offer');
    }
  };

  return (
    <ManagementPage
      title='Offer Management'
      description='Only offers created here will appear publicly.'
      loading={loading}
      action={<p className='text-xs font-bold text-gray-500'>{activeCount} active offers</p>}
    >
      <Card className='mb-8'>
        <CardContent className='p-6'>
          <form onSubmit={handleCreate} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              placeholder='Offer title'
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <Input
              placeholder='Offer code (e.g. SAVE20)'
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              required
            />
            <Input
              placeholder='Tag (e.g. LIMITED, BOGO)'
              value={form.tag}
              onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
            />
            <select
              className='h-10 rounded-md border border-gray-200 px-3 text-sm'
              value={form.discountType}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' }))
              }
            >
              <option value='PERCENTAGE'>Percentage (%)</option>
              <option value='FIXED'>Fixed amount</option>
            </select>
            <Input
              type='number'
              min='1'
              placeholder='Discount value'
              value={form.discountValue}
              onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
              required
            />
            <Input
              type='number'
              min='0'
              placeholder='Minimum order amount'
              value={form.minOrderAmount}
              onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
            />
            <Input
              type='number'
              min='1'
              placeholder='Usage limit (optional)'
              value={form.usageLimit}
              onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
            />
            <Input
              placeholder='Description'
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
            <div className='md:col-span-2'>
              <Button type='submit' isLoading={submitting}>
                <Plus size={16} className='mr-2' /> Create Offer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className='p-5 space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-bold text-gray-900'>{offer.title}</p>
                  <p className='text-xs text-gray-500'>{offer.description}</p>
                </div>
                <span className='text-xs font-bold px-2 py-1 rounded bg-gray-100'>{offer.tag}</span>
              </div>
              <div className='text-sm font-semibold flex items-center gap-2 text-orange-600'>
                <Tag size={14} /> {offer.code}
                <button
                  type='button'
                  onClick={() => navigator.clipboard.writeText(offer.code)}
                  className='text-gray-400 hover:text-gray-700'
                >
                  <Copy size={14} />
                </button>
              </div>
              <p className='text-sm text-gray-700 flex items-center gap-2'>
                <Percent size={14} />
                {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}%` : `${offer.discountValue} off`}
                , min order {offer.minOrderAmount}
              </p>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={() => toggleActive(offer)}>
                  {offer.isActive ? 'Hide' : 'Activate'}
                </Button>
                <Button variant='destructive' onClick={() => handleDelete(offer.id)}>
                  <Trash2 size={14} className='mr-1' /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ManagementPage>
  );
}
