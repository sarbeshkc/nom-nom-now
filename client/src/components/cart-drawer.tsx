"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useNavigate } from "react-router-dom"
//import Image from "next/image"

export function CartDrawer() {
  const cart = useCartStore()
  const navigate = useNavigate()

  if (cart.items.length === 0) {
    return null
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-[30%] bg-white shadow-xl p-6 pt-24">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6" />
        <h2 className="text-xl font-semibold">My Order</h2>
      </div>

      <div className="space-y-6 mb-6 max-h-[50vh] overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => cart.removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">NPR {item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>NPR {cart.subtotal()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fee</span>
          <span>NPR {cart.deliveryFee}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>NPR {cart.total()}</span>
        </div>

        <Button className="w-full bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={() => navigate("/checkout")}>
          Order and checkout
        </Button>
      </div>
    </div>
  )
}

