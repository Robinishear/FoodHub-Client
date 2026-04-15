"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { managerService } from "@/services/managerService";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import { toast } from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  _count?: {
    meals: number;
  };
}

export default function ManagerCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Since we don't have a getCategories endpoint in managerService, 
    // we'll need to add it or use mealService
    const fetchCategories = async () => {
      try {
        // For now, show a placeholder
        setError("Categories endpoint needs to be added to managerService");
      } catch (err) {
        setError("Failed to load categories. Backend API may not be available.");
        console.error("Categories fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreating(true);
    try {
      await managerService.categories.create(newCategoryName.trim());
      toast.success("Category created successfully");
      setNewCategoryName("");
      // Refresh categories
    } catch (err) {
      toast.error("Failed to create category. Backend API may not be available.");
      console.error("Category creation error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <ManagementPage title="Categories Management" description="Create and manage food categories">
        <div className="space-y-8">
          {error && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Utensils size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">API Notice</h3>
                  <p className="text-sm text-orange-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Create New Category */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus size={20} />
                Create New Category
              </CardTitle>
            </CardHeader>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button 
                onClick={handleCreateCategory}
                disabled={isCreating || !newCategoryName.trim()}
                className="px-6"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </Card>
              ))
            ) : categories.length === 0 ? (
              <Card className="p-12 text-center md:col-span-2 lg:col-span-3">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Utensils size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h3>
                <p className="text-gray-500">Create your first category to organize meals.</p>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">
                        {category._count?.meals || 0} meals
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
