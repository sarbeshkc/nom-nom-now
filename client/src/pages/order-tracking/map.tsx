'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map() {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      // Center on Kavre, Nepal
      mapRef.current = L.map('map').setView([27.6257, 85.5376], 14)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current)

      // Add a marker for the restaurant
      const restaurantIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      })

      // Add a marker for the delivery person
      const deliveryIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      })

      // Add restaurant marker
      L.marker([27.6257, 85.5376], { icon: restaurantIcon })
        .addTo(mapRef.current)
        .bindPopup('Nom Nom Now Restaurant')

      // Add delivery person marker
      L.marker([27.6280, 85.5390], { icon: deliveryIcon })
        .addTo(mapRef.current)
        .bindPopup('Your order is on the way!')
        .openPopup()

      // Draw a line between restaurant and delivery person
      const latlngs = [
        [27.6257, 85.5376],
        [27.6280, 85.5390]
      ]
      
    //   L.polyline(latlngs, {
    //     color: '#FF4500',
    //     weight: 3,
    //     opacity: 0.7,
    //     dashArray: '10, 10'
    //   }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return <div id="map" className="h-full w-full" />
}

