// 'use client'

// import { createContext, useContext, useState, useCallback } from 'react'

// interface CartItem {
//   id: string
//   name: string
//   price: number
//   quantity: number
//   image: string
// }

// interface CartContextType {
//   items: CartItem[]
//   addItem: (item: Omit<CartItem, 'quantity'>) => void
//   removeItem: (id: string) => void
//   updateQuantity: (id: string, quantity: number) => void
//   subtotal: number
//   total: number
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([])

//   const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
//     setItems(currentItems => {
//       const existingItem = currentItems.find(i => i.id === item.id)
//       if (existingItem) {
//         return currentItems.map(i =>
//           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//         )
//       }
//       return [...currentItems, { ...item, quantity: 1 }]
//     })
//   }, [])

//   const removeItem = useCallback((id: string) => {
//     setItems(currentItems => currentItems.filter(item => item.id !== id))
//   }, [])

//   const updateQuantity = useCallback((id: string, quantity: number) => {
//     setItems(currentItems =>
//       quantity === 0
//         ? currentItems.filter(item => item.id !== id)
//         : currentItems.map(item =>
//             item.id === id ? { ...item, quantity } : item
//           )
//     )
//   }, [])

//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   const deliveryFee = items.length > 0 ? 9.20 : 0
//   //const taxes = subtotal * 0.15 // 15% tax
//   const total = subtotal + deliveryFee 

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addItem,
//         removeItem,
//         updateQuantity,
//         subtotal,
//         total
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (!context) throw new Error('useCart must be used within a CartProvider')
//   return context
// }

