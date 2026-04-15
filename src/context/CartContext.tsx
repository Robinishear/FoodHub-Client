"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Meal } from "@/types";
import { toast } from "react-hot-toast";

export interface CartItem extends Meal {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (meal: Meal) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return [];
    try {
      return JSON.parse(storedCart) as CartItem[];
    } catch {
      localStorage.removeItem("cart");
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (meal: Meal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
    toast.success(`Added ${meal.title} to cart`);
  };

  const removeFromCart = (mealId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== mealId));
    toast.error("Removed from cart");
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === mealId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
