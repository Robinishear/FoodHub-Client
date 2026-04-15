"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { managerService } from "@/services/managerService";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customerName: string;
  providerName: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  deliveryAddress?: string;
}

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await managerService.getAllOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders. Backend API may not be available.");
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'READY': return 'bg-green-50 text-green-700 border-green-200';
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />;
      case 'CONFIRMED': return <Eye size={16} />;
      case 'PREPARING': return <Package size={16} />;
      case 'READY': 
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["MANAGER"]}>
      <ManagementPage title="Orders Management" description="Monitor and manage all platform orders">
        <div className="space-y-8">
          {error && (
            <Card className="p-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">API Notice</h3>
                  <p className="text-sm text-orange-700">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-500">No orders are currently in the system.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">Order #{order.id.slice(-8)}</h4>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Customer</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Provider</p>
                      <p className="font-medium text-gray-900">{order.providerName}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Items</p>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-400">+{order.items.length - 2} more items</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <p className="font-bold text-lg text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      <Button size="sm" variant="outline" className="rounded-lg">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ManagementPage>
    </ProtectedRoute>
  );
}
