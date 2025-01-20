import { CheckCircle2, Package } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
//path = (/order-track)
export function OrderConfirmation() {
  const handleNavigate = (path) => {
    // Handle navigation here based on your routing setup
    window.location.href = path
  }

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl text-green-500">Order Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-gray-600">
            Your order has been placed successfully and will be delivered soon.
          </p>
          <p className="text-sm text-gray-500">
            Order number: #NPL{Math.random().toString().slice(2, 10)}
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-gray-50 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-[#FF4500]">
            <Package className="h-5 w-5" />
            <span className="font-medium">Track Your Order</span>
          </div>
          {/* <p className="text-sm text-gray-600">
            You will receive an SMS and email with your order confirmation and tracking details.
          </p> */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => handleNavigate('/orders')}
        >
          View Order Status
        </Button>
        <Button 
          className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
          onClick={() => handleNavigate('/menu')}
        >
          Order More Food
        </Button>
      </CardFooter>
    </>
  )
}