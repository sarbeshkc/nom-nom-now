"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock } from "lucide-react"
//import Image from "next/image"

interface SummaryStepProps {
  deliveryDetails: {
    type: string
    province: string
    district: string
    municipality: string
    ward: string
    street: string
    landmark: string
    phone: string
    alternativePhone: string
  }
  onBack: () => void
  onNext: () => void
}

export function SummaryStep({ deliveryDetails, onBack, onNext }: SummaryStepProps) {
  const cart = useCartStore()

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-[#FF4D00]" />
            <h3 className="font-medium">Contact Information</h3>
          </div>
          <p>{deliveryDetails.phone}</p>
          {deliveryDetails.alternativePhone && <p>{deliveryDetails.alternativePhone}</p>}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#FF4D00]" />
            <h3 className="font-medium">Delivery Location</h3>
          </div>
          <p>
            Ward {deliveryDetails.ward}, {deliveryDetails.street}
          </p>
          <p>
            {deliveryDetails.municipality}, {deliveryDetails.district}
          </p>
          {deliveryDetails.landmark && <p className="text-gray-600">Landmark: {deliveryDetails.landmark}</p>}
        </div>

        <div>
          <h3 className="font-medium mb-4">Order Items</h3>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">NPR {item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#FF4D00]" />
            <h3 className="font-medium">Estimated Delivery Time</h3>
          </div>
          <p>45-60 minutes</p>
        </div>

        <div className="space-y-2">
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
          <Button className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={onNext}>
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}

