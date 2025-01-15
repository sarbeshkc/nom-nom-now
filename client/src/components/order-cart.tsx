import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const orderItems = [
  { name: 'Chicken Biryani', quantity: 2, price: 15.99 },
  { name: 'Vegetable Momo', quantity: 1, price: 8.99 },
  { name: 'Mango Lassi', quantity: 2, price: 3.99 },
]

export function OrderCart() {
  const totalPrice = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {orderItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-semibold">${(item.quantity * item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

