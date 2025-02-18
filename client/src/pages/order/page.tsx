'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { Package, MapPin } from 'lucide-react'
import { useEffect, useRef } from 'react'
import BasicMap from '@/components/ui/MapComponent'

export default function OrderPage() {
  const handleLocationSelect = (lat, lng) => {
    console.log(`Selected Location: Latitude: ${lat}, Longitude: ${lng}`);
    // You can also update state or perform other actions based on the selected location
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#FFF5F2] to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600 mb-8">Order ID: #NOM123456</p>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Order Details Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-[#FF4D00]" />
                <h2 className="text-xl font-semibold">Order Details</h2>
              </div>

              <div className="space-y-6">
                {/* Chicken Momo */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-medium">Chicken Momo</h3>
                    <p className="text-sm text-gray-500">With Special Sauce</p>
                    <p className="text-[#FF4D00] mt-1">Rs. 250</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md">-</button>
                    <span className="w-8 text-center">2</span>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md">+</button>
                  </div>
                </div>

                {/* Veg Chowmein */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-medium">Veg Chowmein</h3>
                    <p className="text-sm text-gray-500">Extra Spicy</p>
                    <p className="text-[#FF4D00] mt-1">Rs. 180</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md">-</button>
                    <span className="w-8 text-center">1</span>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md">+</button>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-[#FF4D00] font-semibold">Rs. 680</span>
                  </div>
                </div>

                {/* Order Status */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Order Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#FF4D00]" />
                      <span className="text-gray-900">Order Confirmed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#FF4D00]" />
                      <span className="text-gray-900">Being Prepared</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-gray-400">Out for Delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <span className="text-gray-400">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Tracking Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-[#FF4D00]" />
                <h2 className="text-xl font-semibold">Live Tracking</h2>
              </div>
              <BasicMap onLocationSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}