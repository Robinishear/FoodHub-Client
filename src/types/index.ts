export type Role =
  | "CUSTOMER"
  | "PROVIDER"
  | "ADMIN"
  | "MANAGER"
  | "ORGANIZER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  googleId?: string | null;
  providerProfile?: ProviderProfile;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  shopName: string;
  address: string;
  cuisine?: string;
  rating: number;
  meals?: Meal[];
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    meals: number;
  };
}

export interface Meal {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  providerId: string;
  isAvailable: boolean;
  averageRating?: number;
  category?: Category;
  provider?: ProviderProfile & { user: { name: string } };
}

export interface Order {
  id: string;
  userId: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  address: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  user?: { name: string; email: string };
}

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: number;
  meal: Meal;
}

export interface Review {
  id: string;
  userId: string;
  mealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name: string };
}
