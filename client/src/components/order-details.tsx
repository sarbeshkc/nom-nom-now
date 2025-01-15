import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package } from 'lucide-react'

export function OrderDetails() {
  const orderItems = [
    {
      name: 'Chicken Momo',
      description: 'With Special Sauce',
      quantity: 2,
      price: 250
    },
    {
      name: 'Veg Chowmein',
      description: 'Extra Spicy',
      quantity: 1,
      price: 180
    }
  ]

  const orderStatus = [
    { label: 'Order Confirmed', completed: true },
    { label: 'Being Prepared', completed: true },
    { label: 'Out for Delivery', completed: false },
    { label: 'Delivered', completed: false }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Package className="w-5 h-5 text-[#FF4D00]" />
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orderItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center">
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#FF4D00]">Rs. {item.price}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-[#FF4D00]">Rs. 680</span>
            </div>
          </div>

          <div className="space-y-3">
            {orderStatus.map((status, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status.completed ? 'bg-[#FF4D00]' : 'bg-gray-200'}`} />
                <span className={status.completed ? 'text-gray-900' : 'text-gray-400'}>
                  {status.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

