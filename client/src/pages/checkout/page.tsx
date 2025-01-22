"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import { CartStep } from "@/components/checkout/cart-step"
import { DeliveryStep } from "@/components/checkout/delivery-step"
import { SummaryStep } from "@/components/checkout/summary-step"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ConfirmationStep } from "@/components/checkout/confirmation-step"

type CheckoutStep = "cart" | "delivery" | "summary" | "payment" | "confirmation"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart")
  const [deliveryDetails, setDeliveryDetails] = useState({
    type: "delivery",
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
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <div className="w-64 shrink-0">
              <nav className="space-y-1">
                {[
                  { id: "cart", label: "Cart" },
                  { id: "delivery", label: "Delivery" },
                  { id: "summary", label: "Summary" },
                  { id: "payment", label: "Payment" },
                ].map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg ${
                      currentStep === step.id ? "bg-[#FF4D00] text-white" : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex-1">{steps[currentStep]}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

