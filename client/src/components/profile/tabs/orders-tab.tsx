// File: src/components/profile/tabs/orders-tab.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import api from '@/services/api'
import { Clock, Package } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/user/orders')
        setOrders(response.data)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View and track your orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium">Order #{order.orderNumber}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF4500]/10 text-[#FF4500]">
                    {order.status}
                  </span>
                  <p className="mt-1 font-medium">
                    NPR {order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>
                      NPR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}

          {orders.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

