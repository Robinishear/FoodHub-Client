"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { managerService } from "@/services/managerService";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, User, Calendar, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  customer: {
    name: string;
    email?: string;
  };
  meal: {
    name: string;
    provider: {
      name: string;
    };
  };
  createdAt: string;
  isVerified: boolean;
}

export default function ManagerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await managerService.reviews.getAll();
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews. Backend API may not be available.");
        console.error("Reviews fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await managerService.reviews.delete(reviewId);
      toast.success("Review deleted successfully");
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (err) {
      toast.error("Failed to delete review. Backend API may not be available.");
      console.error("Review deletion error:", err);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-50 text-green-700 border-green-200';
    if (rating >= 3) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <ManagementPage title="Review Moderation" description="Monitor and moderate customer reviews">
        <div className="space-y-8">
          {error && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">API Notice</h3>
                  <p className="text-sm text-orange-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Reviews Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Reviews</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Star size={24} className="text-green-600 fill-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.length > 0 
                      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                      : "0"
                    }
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Avg Rating</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star size={24} className="text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.filter(r => r.rating >= 4).length}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Positive</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Star size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.filter(r => r.rating <= 2).length}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Negative</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </Card>
              ))
            ) : reviews.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-500">No customer reviews are available yet.</p>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <Badge className={getRatingColor(review.rating)}>
                          {review.rating}/5
                        </Badge>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-1">{review.meal.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          {review.customer.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          {review.meal.provider.name}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-4"
                      onClick={() => handleDeleteReview(review.id)}
                    >
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
