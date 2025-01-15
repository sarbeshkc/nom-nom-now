// src/contexts/CartContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Implementation here
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};