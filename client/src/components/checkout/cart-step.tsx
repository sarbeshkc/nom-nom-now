"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
//import Image from "next/image"
import { Minus, Plus, ShoppingBag } from "lucide-react"

interface CartStepProps {
  onNext: () => void
}

export function CartStep({ onNext }: CartStepProps) {
  const cart = useCartStore()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-6 h-6 text-[#FF4D00]" />
        <h1 className="text-2xl font-bold">Your Order</h1>
      </div>

      {cart.items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b py-4">
          <div className="w-24 h-24 bg-gray-100 rounded-lg relative overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (item.quantity > 1) {
                      cart.updateQuantity(item.id, item.quantity - 1)
                    } else {
                      cart.removeItem(item.id)
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="font-medium">NPR {item.price}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>NPR {cart.subtotal()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>NPR {cart.deliveryFee}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>NPR {cart.total()}</span>
        </div>
      </div>

      <Button className="w-full mt-8 bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={onNext}>
        Review Order
      </Button>
    </div>
  )
}

