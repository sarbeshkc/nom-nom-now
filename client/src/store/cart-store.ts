import { create } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import type { StateCreator } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  deliveryFee: number;
  total: () => number;
}

type CartStorePersist = (config: StateCreator<CartStore>, options: PersistOptions<CartStore>) => StateCreator<CartStore>;

export const useCartStore = create<CartStore>(
  (persist as CartStorePersist)(
    (set, get) => ({
      items: [],
      deliveryFee: 100,
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (itemId: number) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId: number, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () => {
        const items = get().items;
        return items.reduce(
          (sum: number, item: { price: number; quantity: number }) =>
            sum + item.price * item.quantity,
          0
        );
      },
      total: () => {
        return get().subtotal() + get().deliveryFee;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);