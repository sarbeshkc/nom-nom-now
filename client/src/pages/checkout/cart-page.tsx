'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, ShoppingBag } from 'lucide-react'
//import Image from "next/image"
import { CartItem } from "./page"

interface CartPageProps {
  items: CartItem[]
  onNext: () => {
    
  }
}

export function CartPage({ items, onNext }: CartPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  // Auto-slide images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5 text-[#FF780B]" />
          <span>Your Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Carousel */}
        <div className="relative h-[300px] rounded-xl overflow-hidden bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* <img
                src={items[currentImageIndex].image || "/placeholder.svg"}
                alt={items[currentImageIndex].name}
                //fill
                className="object-cover"
              /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {/* <h3 className="text-2xl font-semibold text-white">{items[currentImageIndex].name}</h3> */}
                {/* <p className="text-lg text-white/90 mt-2">{items[currentImageIndex].description}</p> */}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                {/* <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  //fill
                  className="object-cover"
                /> */}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-gray-500">{item.description}</p>
                <div className="text-[#FF780B] font-semibold mt-1">NPR {item.price}</div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => {/* Handle decrease */}}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-lg font-medium">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => {/* Handle increase */}}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-6">
        <div className="text-lg">
          Subtotal: <span className="font-semibold text-[#FF780B]">NPR {subtotal}</span>
        </div>
        <Button 
          onClick={onNext}
          className="bg-[#FF780B] hover:bg-[#FF780B]/90 text-white px-8"
        >
          Review Order
        </Button>
      </CardFooter>
    </>
  )
}

