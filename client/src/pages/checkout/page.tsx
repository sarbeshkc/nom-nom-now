"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import { CartStep } from "@/components/checkout/cart-step"
import { DeliveryStep } from "@/components/checkout/delivery-step"
import { SummaryStep } from "@/components/checkout/summary-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ConfirmationStep } from "@/components/checkout/confirmation-step"
import { StepNavigation } from "@/components/checkout/step-navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

type CheckoutStep = "cart" | "delivery" | "summary" | "payment" | "confirmation"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart")
  const [deliveryDetails, setDeliveryDetails] = useState({
    type: "delivery",
    pickupType: "designated",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    street: "",
    landmark: "",
    phone: "",
    alternativePhone: "",
  })

  const steps = {
    cart: <CartStep onNext={() => setCurrentStep("delivery")} />,
    delivery: (
      <DeliveryStep
        deliveryDetails={deliveryDetails}
        setDeliveryDetails={setDeliveryDetails}
        onBack={() => setCurrentStep("cart")}
        onNext={() => setCurrentStep("summary")}
      />
    ),
    summary: (
      <SummaryStep
        deliveryDetails={deliveryDetails}
        onBack={() => setCurrentStep("delivery")}
        onNext={() => setCurrentStep("payment")}
      />
    ),
    payment: <PaymentStep onBack={() => setCurrentStep("summary")} onNext={() => setCurrentStep("confirmation")} />,
    confirmation: <ConfirmationStep />,
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <div className="w-64 shrink-0">
              <StepNavigation currentStep={currentStep} />
            </div>
            <div className="flex-1">
              <Card className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep]}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

