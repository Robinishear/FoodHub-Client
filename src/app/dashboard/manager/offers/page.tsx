"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { managerService } from "@/services/managerService";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, Calendar, Percent, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";

interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  tag: string;
  color: string;
  image?: string;
}

export default function ManagerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await managerService.offers.getAll();
        setOffers(data);
      } catch (err) {
        setError("Failed to load offers. Backend API may not be available.");
        console.error("Offers fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await managerService.offers.delete(offerId);
      toast.success("Offer deleted successfully");
      setOffers(offers.filter(offer => offer.id !== offerId));
    } catch (err) {
      toast.error("Failed to delete offer. Backend API may not be available.");
      console.error("Offer deletion error:", err);
    }
  };

  const getDiscountDisplay = (offer: Offer) => {
    if (offer.discountType === 'PERCENTAGE') {
      return `${offer.discountValue}%`;
    } else {
      return `$${offer.discountValue}`;
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getStatusColor = (offer: Offer) => {
    if (!offer.isActive || isExpired(offer.expiresAt)) {
      return 'bg-gray-50 text-gray-700 border-gray-200';
    }
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const getStatusText = (offer: Offer) => {
    if (!offer.isActive) return 'Inactive';
    if (isExpired(offer.expiresAt)) return 'Expired';
    return 'Active';
  };

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <ManagementPage title="Offers & Promotions" description="Manage discount codes and promotional offers">
        <div className="space-y-8">
          {error && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">API Notice</h3>
                  <p className="text-sm text-orange-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Create New Offer Button */}
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Promotional Offers</h3>
                <p className="text-sm text-gray-500">Create discount codes to attract more customers</p>
              </div>
              <Button className="px-6">
                <Plus size={20} className="mr-2" />
                Create Offer
              </Button>
            </div>
          </Card>

          {/* Offers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </Card>
              ))
            ) : offers.length === 0 ? (
              <Card className="p-12 text-center md:col-span-2 lg:col-span-3">
                <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Tag size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Found</h3>
                <p className="text-gray-500">Create promotional offers to boost sales.</p>
              </Card>
            ) : (
              offers.map((offer) => (
                <Card key={offer.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{offer.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
                    </div>
                    <Badge className={getStatusColor(offer)}>
                      {getStatusText(offer)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        {offer.discountType === 'PERCENTAGE' ? (
                          <Percent size={16} className="text-orange-600" />
                        ) : (
                          <DollarSign size={16} className="text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">{getDiscountDisplay(offer)}</p>
                        <p className="text-xs text-gray-500">Discount</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Tag size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-gray-900">{offer.code}</p>
                        <p className="text-xs text-gray-500">Code</p>
                      </div>
                    </div>

                    {offer.minOrderAmount && (
                      <div className="text-xs text-gray-500">
                        Min. order: ${offer.minOrderAmount}
                      </div>
                    )}

                    {offer.expiresAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        Expires: {new Date(offer.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteOffer(offer.id)}
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
