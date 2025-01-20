'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartPage } from './cart-page'
import { DeliveryDetails } from './delivery-details'
import { OrderSummary } from './order-summary'
import { PaymentPage } from './payment-page'
import { OrderConfirmation } from './order-confirmation'
import { Card } from '@/components/ui/card'
import { ShoppingCart, Navigation, Receipt, CreditCard, Check } from 'lucide-react'

type CheckoutStep = 'cart' | 'delivery' | 'summary' | 'payment' | 'confirmation'

export type DeliveryMethod = 'delivery' | 'pickup'
export type PickupType = 'designated' | 'restaurant'

export interface DeliveryDetailsType {
  method: DeliveryMethod
  pickupType?: PickupType
  province: string
  district: string
  municipality: string
  wardNo: string
  tole: string
  landmark: string
  phone: string
  deliveryPhone?: string
}

export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

const DELIVERY_FEE = 100 // NPR

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsType>({
    method: 'delivery',
    province: '',
    district: '',
    municipality: '',
    wardNo: '',
    tole: '',
    landmark: '',
    phone: '',
    deliveryPhone: ''
  })

  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Chicken Momo',
      description: 'Steamed dumplings with special sauce',
      price: 180,
      quantity: 1,
      image: '/placeholder.svg?height=80&width=80&text=🥟'
    },
    {
      id: '2',
      name: 'Chow Mein',
      description: 'Nepali style noodles with vegetables',
      price: 160,
      quantity: 2,
      image: '/placeholder.svg?height=80&width=80&text=🍜'
    }
  ])

  const handleNext = (nextStep: CheckoutStep) => {
    setStep(nextStep)
  }

  const handleDeliverySubmit = (details: DeliveryDetailsType) => {
    setDeliveryDetails(details)
    setStep('summary')
  }

  const steps = [
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'delivery', label: 'Delivery', icon: Navigation },
    { id: 'summary', label: 'Summary', icon: Receipt },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: Check }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            {/* Left Sidebar - Steps */}
            <div className="space-y-4">
              {steps.map((s, index) => {
                const isActive = s.id === step
                const isCompleted = steps.findIndex(x => x.id === step) > index
                const Icon = s.icon

                return (
                  <div
                    key={s.id}
                    className={`relative rounded-lg p-4 transition-all duration-200
                      ${isActive ? 'bg-[#FF780B] text-white shadow-lg' :
                        isCompleted ? 'bg-orange-50 text-[#FF780B]' : 'bg-white text-gray-500'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full
                        ${isActive ? 'bg-white/20' :
                          isCompleted ? 'bg-[#FF780B]/10' : 'bg-gray-100'}
                      `}>
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{s.label}</div>
                        {isActive && (
                          <div className="text-sm text-white/80">Current step</div>
                        )}
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="absolute left-7 top-[calc(100%-8px)] h-8 w-px bg-gray-200" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right Content */}
            <Card className="shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {step === 'cart' && (
                    <CartPage
                      items={cartItems}
                      onNext={() => handleNext('delivery')}
                    />
                  )}
                  {step === 'delivery' && (
                    <DeliveryDetails
                      onSubmit={handleDeliverySubmit}
                    />
                  )}
                  {step === 'summary' && (
                    <OrderSummary
                      items={cartItems}
                      deliveryDetails={deliveryDetails}
                      deliveryFee={DELIVERY_FEE}
                      onNext={() => handleNext('payment')}
                      onBack={() => handleNext('delivery')}
                    />
                  )}
                  {step === 'payment' && (
                    <PaymentPage
                      items={cartItems}
                      deliveryDetails={deliveryDetails}
                      deliveryFee={DELIVERY_FEE}
                      onSuccess={() => handleNext('confirmation')}
                      onBack={() => handleNext('summary')}
                    />
                  )}
                  {step === 'confirmation' && (
                    <OrderConfirmation />
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
