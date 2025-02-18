"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/cart-store"
import { Banknote, CreditCard, Wallet } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentStepProps {
  onBack: () => void
  onNext: () => void
}

export function PaymentStep({ onBack, onNext }: PaymentStepProps) {
  const cart = useCartStore()
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  })

  const paymentMethods = [
    {
      id: "cash",
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay with cash when your order arrives",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      id: "card",
      name: "Card Payment",
      icon: CreditCard,
      description: "Pay securely with your credit or debit card",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      id: "esewa",
      name: "eSewa",
      icon: Wallet,
      description: "Pay using your eSewa wallet",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: Wallet,
      description: "Pay using your Khalti wallet",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${method.bgColor} p-6 rounded-lg cursor-pointer transition-all
                ${selectedMethod === method.id ? "ring-2 ring-[#FF4D00]" : ""}
              `}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`${method.iconBg} p-3 rounded-full`}>
                  <method.icon className="w-6 h-6 text-[#FF4D00]" />
                </div>
                <div>
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selectedMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 p-6 rounded-lg space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVV</label>
                  <Input
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    className="bg-white"
                    type="password"
                    maxLength={3}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <Input placeholder="Enter your phone number" className="bg-white" />
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="text-[#FF4D00]">NPR {cart.subtotal()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span className="text-[#FF4D00]">NPR {cart.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-[#FF4D00]">NPR {cart.total()}</span>
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

