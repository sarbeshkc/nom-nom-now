//import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem, DeliveryDetailsType } from '../checkout/page'
import { Clock, MapPin, Phone, Receipt } from 'lucide-react'

interface OrderSummaryProps {
  items: CartItem[]
  deliveryDetails: DeliveryDetailsType
  deliveryFee: number
  onNext: () => void
  onBack: () => void
}

export function OrderSummary({ items, deliveryDetails, deliveryFee, onNext, onBack }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const total = subtotal + deliveryFee
  const estimatedTime = "45-60 minutes"

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5 text-[#FF780B]" />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="grid gap-4 p-6 rounded-xl bg-gray-50">
          <h3 className="font-semibold flex items-center space-x-2">
            <Phone className="h-4 w-4 text-[#FF780B]" />
            <span>Contact Information</span>
          </h3>
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

        {/* Location Information */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-gray-50 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-[#FF780B] mx-auto" />
              <h3 className="font-semibold">Delivery Location</h3>
              <p className="text-gray-600">
                Ward {deliveryDetails.wardNo}, {deliveryDetails.tole},
                {deliveryDetails.municipality}, {deliveryDetails.district}
              </p>
              <p className="text-sm text-gray-500">
                Landmark: {deliveryDetails.landmark}
              </p>
            </div>
          </div>
        </div>


        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-semibold">Order Items</h3>
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                {/* <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                /> */}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="font-semibold text-[#FF780B]">NPR {item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        {/* Delivery Time */}
        <div className="p-4 rounded-lg bg-orange-50 flex items-center space-x-3">
          <Clock className="h-5 w-5 text-[#FF780B]" />
          <div>
            <div className="font-medium">Estimated Delivery Time</div>
            <div className="text-sm text-gray-600">{estimatedTime}</div>
          </div>
        </div>

        {/* Total */}
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
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="bg-[#FF780B] hover:bg-[#FF780B]/90 text-white"
        >
          Continue to Payment
        </Button>
      </CardFooter>
    </>
  )
}

