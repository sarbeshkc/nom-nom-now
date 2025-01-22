"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { Banknote, CreditCard, Wallet } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PaymentStepProps {
  onBack: () => void
  onNext: () => void
}

export function PaymentStep({ onBack, onNext }: PaymentStepProps) {
  const cart = useCartStore()
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  const paymentMethods = [
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay with cash when your order arrives",
    },
    {
      id: "card",
      name: "Card Payment",
      icon: CreditCard,
      description: "Pay securely with your credit or debit card",
    },
    {
      id: "esewa",
      name: "eSewa",
      icon: Wallet,
      description: "Pay using your eSewa wallet",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: Wallet,
      description: "Pay using your Khalti wallet",
    },
  ]

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedMethod === method.id ? "border-[#FF4D00] bg-orange-50" : "border-gray-200"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-3">
                <method.icon className="w-6 h-6 text-[#FF4D00]" />
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <Input placeholder="Enter your phone number" />
        </div>

        <div className="space-y-4 pt-6 border-t">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>NPR {cart.subtotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>NPR {cart.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>NPR {cart.total()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={onNext} disabled={!selectedMethod}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
}

