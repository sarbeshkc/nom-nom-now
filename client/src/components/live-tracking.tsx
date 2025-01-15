'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export function LiveTracking() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map centered on Dhulikhel
    mapRef.current = L.map(mapContainerRef.current).setView([27.6257, 85.5387], 13)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current)

    // Add restaurant marker (example location)
    const restaurantIcon = L.divIcon({
      html: `<div class="w-6 h-6 rounded-full bg-[#FF4D00] flex items-center justify-center">
              <div class="w-3 h-3 bg-white rounded-full"></div>
            </div>`,
      className: 'restaurant-marker'
    })

    const deliveryIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-[#FF4D00] text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`,
      className: 'delivery-marker'
    })

    // Add markers
    L.marker([27.6257, 85.5387], { icon: restaurantIcon }).addTo(mapRef.current)
    L.marker([27.6200, 85.5300], { icon: deliveryIcon }).addTo(mapRef.current)

    // Add delivery route
    const routeCoordinates = [
      [27.6257, 85.5387],
      [27.6200, 85.5300]
    ]

    // L.polyline(routeCoordinates, {
    //   color: '#FF4D00',
    //   weight: 3,
    //   opacity: 0.8,
    //   dashArray: '10, 10'
    // }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <MapPin className="w-5 h-5 text-[#FF4D00]" />
        <CardTitle>Live Tracking</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            ref={mapContainerRef} 
            className="h-[600px] w-full rounded-b-lg"
          />
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-[#FF4D00]" />
              <span className="text-sm font-medium">Your order is on the way!</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Estimated delivery time: 30 minutes
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

