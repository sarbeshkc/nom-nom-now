"use client"

import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Check } from "lucide-react"
import { useCartStore } from "@/store/cart-store"

export function ConfirmationStep() {
  const navigate = useNavigate()
  const clearCart = useCartStore((state) => state.clearCart)

  const handleViewStatus = () => {
    clearCart();
    navigate("/order")
  }

  const handleOrderMore = () => {
    clearCart()
    navigate("/menu")
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-500 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">Your order has been placed successfully and will be delivered soon.</p>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-600">Order number:</p>
        <p className="font-medium">#NPL60929535</p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          You will receive an SMS and email with your order confirmation and tracking details.
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={handleViewStatus}>
            View Order Status
          </Button>
          <Button className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={handleOrderMore}>
            Order More Food
          </Button>
        </div>
      </div>
    </div>
  )
}

