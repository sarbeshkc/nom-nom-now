"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Send, FileText, CreditCard } from "lucide-react"

interface StepNavigationProps {
  currentStep: string
}

export function StepNavigation({ currentStep }: StepNavigationProps) {
  const steps = [
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "delivery", label: "Delivery", icon: Send },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "payment", label: "Payment", icon: CreditCard },
  ]

  return (
    <div className="space-y-2">
      {steps.map((step) => {
        const isActive = currentStep === step.id
        const isPast = false // You can add logic to determine past steps

        return (
          <motion.div
            key={step.id}
            className={`relative flex items-center gap-4 p-4 rounded-lg cursor-pointer
              ${isActive ? "bg-[#FF4D00] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                ${isActive ? "bg-white/20" : "bg-gray-100"}`}
              >
                <step.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
              </div>
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  animate={{
                    borderColor: isPast ? "#FF4D00" : "transparent",
                  }}
                />
              )}
            </div>
            <div>
              <p className={`font-medium ${isActive ? "text-white" : "text-gray-900"}`}>{step.label}</p>
              {isActive && <p className="text-sm text-white/80">Current step</p>}
            </div>
            {isActive && (
              <motion.div
                className="absolute left-0 w-1 h-full bg-[#FF4D00] rounded-full"
                layoutId="activeStep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

