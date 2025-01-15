import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DeliveryMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Interactive map placeholder</p>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Your order is on its way! Estimated delivery time: 30 minutes
        </p>
      </CardContent>
    </Card>
  )
}

