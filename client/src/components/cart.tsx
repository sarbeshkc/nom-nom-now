'use client'

import { Minus, Plus, Lock, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
//import Image from 'next/image'
import { useCart } from '../contexts/cart-context'
import { useNavigate } from 'react-router-dom'
interface CartProps {
  onClose: () => void;
}



export function Cart({ onClose }: CartProps) {
  const { items, updateQuantity, removeItem, subtotal, total } = useCart()
  const deliveryFee = items.length > 0 ? 9.20 : 0
  const taxes = subtotal * 0.15
  const navigate = useNavigate();


  return (
    <div className="pt-16 h-screen flex flex-col bg-white border-l">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Order</h2>
        {items.length === 0 && (
          <button
            onClick={() => onClose()}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.length > 0 ? (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <div className="h-16 w-16 relative rounded-lg overflow-hidden bg-gray-100">
                  {/* <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  /> */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">₹{item.price.toFixed(2)}</span>
                      <Lock className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add items to get started</p>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sub total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes</span>
              <span>₹{taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 h-12"
      onClick={() => navigate('/checkout')}

>
            Order and checkout
          </Button>
        </div>
      )}
    </div>
  )
}

