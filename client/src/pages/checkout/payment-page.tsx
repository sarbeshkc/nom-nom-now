'use client'

import { useState } from 'react'
//import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CartItem, DeliveryDetailsType } from "./page"
import { Banknote, CreditCard, Wallet } from 'lucide-react'

interface PaymentPageProps {
  items: CartItem[]
  deliveryDetails: DeliveryDetailsType
  deliveryFee: number
  onSuccess: () => void
  onBack: () => void
}

type PaymentMethod = 'cash' | 'card' | 'esewa' | 'khalti'

interface PaymentOption {
  id: PaymentMethod
  name: string
  icon: React.ReactNode
  description: string
  color: string
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: <Banknote className="h-8 w-8" />,
    description: 'Pay with cash when your order arrives',
    color: '#22C55E'
  },
  {
    id: 'card',
    name: 'Card Payment',
    icon: <CreditCard className="h-8 w-8" />,
    description: 'Pay securely with your credit or debit card',
    color: '#3B82F6'
  },
  {
    id: 'esewa',
    name: 'eSewa',
    icon: <img src="/placeholder.svg?height=32&width=32&text=E" alt="eSewa" className="w-8 h-8" />,
    description: 'Pay using your eSewa wallet',
    color: '#10B981'
  },
  {
    id: 'khalti',
    name: 'Khalti',
    icon: <img src="/placeholder.svg?height=32&width=32&text=K" alt="Khalti" className="w-8 h-8" />,
    description: 'Pay using your Khalti wallet',
    color: '#8B5CF6'
  }
]

export function PaymentPage({ items, deliveryDetails, deliveryFee, onSuccess, onBack }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-[#FF780B]" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Methods Grid */}
        <div className="grid grid-cols-2 gap-4">
          {paymentOptions.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => setPaymentMethod(option.id)}
              className={`
                relative p-6 rounded-xl text-left transition-all duration-200
                ${paymentMethod === option.id ? 'ring-2' : 'ring-1 ring-gray-200'}
              `}
              style={{
                backgroundColor: `${option.color}10`,
                borderColor: option.color,
                ringColor: option.color
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <div className="text-[#FF780B]">{option.icon}</div>
                </div>
                <div>
                  <div className="font-semibold text-lg">{option.name}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
              {paymentMethod === option.id && (
                <motion.div
                  className="absolute inset-0 ring-2 rounded-xl"
                  style={{ borderColor: option.color }}
                  layoutId="selectedPayment"
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 rounded-xl bg-blue-50"
          >
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Information */}
        <div className="grid gap-4 p-6 rounded-xl bg-gray-50">
          <h3 className="font-semibold">Contact Information</h3>
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Your Number:</span>
              <span className="font-medium">{deliveryDetails.phone}</span>
            </div>
            {deliveryDetails.deliveryPhone && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery Person:</span>
                <span className="font-medium">{deliveryDetails.deliveryPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="text-[#FF780B]">NPR {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span className="text-[#FF780B]">NPR {deliveryFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-[#FF780B]">NPR {total}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="submit"
          className="bg-[#FF780B] hover:bg-[#FF780B]/90 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </CardFooter>
    </form>
  )
}