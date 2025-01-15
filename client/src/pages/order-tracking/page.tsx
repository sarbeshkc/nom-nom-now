import React, { Suspense } from 'react'
import { Card } from "@/components/ui/card"
import { MapPin, Package, Plus, Minus } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"

// Use React.lazy instead of next/dynamic
const Map = React.lazy(() => import('./map'))

const orderItems = [
  { 
    name: "Chicken Momo", 
    quantity: 2, 
    price: 250,
    description: "With Special Sauce",
    image: "/placeholder.svg?height=80&width=80"
  },
  { 
    name: "Veg Chowmein", 
    quantity: 1, 
    price: 180,
    description: "Extra Spicy",
    image: "/placeholder.svg?height=80&width=80"
  }
]

const orderStatus = [
  { label: "Order Confirmed", completed: true },
  { label: "Being Prepared", completed: true },
  { label: "Out for Delivery", completed: false },
  { label: "Delivered", completed: false }
]

export default function OrderTrackPage() {
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1">
        {/* Decorative background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground mb-8">Order ID: #NOM123456</p>
            
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Order Details - Takes up 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 backdrop-blur-sm bg-white/50">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#FF4500]" />
                    Order Details
                  </h2>
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-50/80">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="mt-1 text-[#FF4500] font-medium">
                              Rs. {item.price}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 rounded-md hover:bg-gray-100">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button className="p-1 rounded-md hover:bg-gray-100">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Total</h3>
                        <p className="text-2xl font-bold text-[#FF4500]">
                          Rs. {total}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Order Status */}
                <Card className="p-6 backdrop-blur-sm bg-white/50">
                  <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                  <div className="space-y-4">
                    {orderStatus.map((status, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${status.completed ? 'bg-[#FF4500]' : 'bg-gray-300'}`} />
                        <p className={`${status.completed ? 'text-[#FF4500] font-medium' : 'text-muted-foreground'}`}>
                          {status.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Map Section - Takes up 3 columns */}
              <Card className="lg:col-span-3 p-6 backdrop-blur-sm bg-white/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#FF4500]" />
                  Live Tracking
                </h2>
                <div className="h-[700px] rounded-lg overflow-hidden border">
                  <Suspense fallback={
                    <div className="h-[700px] flex items-center justify-center bg-muted">
                      Loading map...
                    </div>
                  }>
                    <Map />
                  </Suspense>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}