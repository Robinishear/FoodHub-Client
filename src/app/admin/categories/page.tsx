/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ManagementPage } from '@/components/dashboard/ManagementPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { adminService } from '@/services/adminService';
import { mealService } from '@/services/mealService';
import { Category } from '@/types';
import {
  Edit,
  Grid,
  Hash,
  LayoutDashboard,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Trash2,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminCategoriesContent />
    </ProtectedRoute>
  );
}

function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Use mealService for shared category fetching
      const categoriesData = await mealService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Categories fetch failed:', error);
      toast.error('Failed to load platform categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = catName.trim();
    if (!normalizedName) {
      toast.error('Please enter a category name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCat) {
        // Update category using professional admin service
        await adminService.categories.update(editingCat.id, normalizedName);
        toast.success(`Category "${normalizedName}" updated!`);
      } else {
        await adminService.categories.create(normalizedName);
        toast.success(`Category "${normalizedName}" created!`);
      }

      setCatName('');
      setEditingCat(null);
      setIsFormOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Category operation failed:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.userMessage ||
        (error.code === 'ERR_NETWORK'
          ? 'Cannot connect to server. Please check if backend is running.'
          : 'Operation failed. Category name might already exist.');

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmMessage =
      'Are you absolutely sure? Deleting this category might hide meals associated with it until they are re-categorized.';
    if (!window.confirm(confirmMessage)) return;

    try {
      await adminService.categories.delete(id);
      toast.success('Category permanently removed.');
      fetchCategories();
    } catch (error: any) {
      console.error('Category deletion failed:', error);
      toast.error(
        'Cannot delete category with active meals. Remove meals first.'
      );
    }
  };

  return (
    <ManagementPage
      title='Food Categories'
      description='Organize meals into logical groups for better discovery.'
      loading={loading}
      action={
        !isFormOpen && (
          <Button onClick={() => setIsFormOpen(true)} className='rounded-md'>
            <Plus size={20} className='mr-2' /> Add Category
          </Button>
        )
      }
    >
      {isFormOpen && (
        <Card className='border-none shadow-2xl shadow-gray-200/50 p-8 rounded-md mb-12 animate-in zoom-in-95 duration-300'>
          <h2 className='text-2xl font-bold mb-8'>
            {editingCat ? 'Edit Category' : 'New Category'}
          </h2>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col md:flex-row gap-4'
          >
            <div className='grow'>
              <Input
                placeholder='Category Name (e.g. Italian, Street Food)'
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
              />
            </div>
            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingCat(null);
                  setCatName('');
                }}
              >
                Cancel
              </Button>
              <Button type='submit' isLoading={isSubmitting}>
                {editingCat ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Card
              key={cat.id}
              className='border-none shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden bg-white'
            >
              <CardContent className='p-6 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='h-10 w-10 bg-gray-50 rounded-md flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors'>
                    <Hash size={20} />
                  </div>
                  <div>
                    <p className='font-black text-gray-900'>{cat.name}</p>
                    <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>
                      {cat._count?.meals || 0} Meals
                    </p>
                  </div>
                </div>

                <div className='flex space-x-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      setEditingCat(cat);
                      setCatName(cat.name);
                      setIsFormOpen(true);
                    }}
                    className='text-gray-300 hover:text-blue-500'
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(cat.id)}
                    className='text-gray-300 hover:text-red-500'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='col-span-full py-24 text-center bg-white rounded-md border border-gray-100 border-dashed'>
            <p className='text-gray-500 font-bold'>
              No categories found. Start by creating one!
            </p>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}
