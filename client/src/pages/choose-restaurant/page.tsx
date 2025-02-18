"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Clock, DollarSign } from "lucide-react"
import { menuItems } from "@/data/menu-items"

export default function ChooseRestaurantPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [itemId, setItemId] = useState<number | null>(null)
  const [itemName, setItemName] = useState<string>("")
  const [availableRestaurants, setAvailableRestaurants] = useState<(typeof menuItems)[0]["availableAt"]>([])
  const addToCart = useCartStore((state) => state.addItem)
  const [layout, setLayout] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const id = searchParams.get("itemId")
    const name = searchParams.get("itemName")
    if (id) {
      setItemId(Number.parseInt(id))
      const item = menuItems.find((item) => item.id === Number.parseInt(id))
      if (item) {
        setAvailableRestaurants(item.availableAt)
      }
    }
    if (name) setItemName(decodeURIComponent(name))
  }, [searchParams])

  const handleChooseRestaurant = (restaurant: (typeof availableRestaurants)[0]) => {
    if (itemId) {
      const item = menuItems.find((item) => item.id === itemId)
      if (item) {
        addToCart({
          id: item.id,
          name: item.name,
          description: `From ${restaurant.name}`,
          price: item.price,
          quantity: 1,
          image: item.image,
        })
        router.push("/menu")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Choose Restaurant for {itemName}</h1>
        <Tabs defaultValue="grid" className="mb-6">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setLayout("grid")}>
              Grid View
            </TabsTrigger>
            <TabsTrigger value="list" onClick={() => setLayout("list")}>
              List View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRestaurants.map((restaurant) => (
                <Card key={restaurant.id}>
                  <CardHeader>
                    <div className="flex items-center">
                      <Image
                        src={restaurant.logo || "/placeholder.svg"}
                        alt={restaurant.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <CardTitle>{restaurant.name}</CardTitle>
                        <CardDescription>{restaurant.cuisine}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span>Min. Order: ₹{restaurant.minOrder}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-[#FF8A0D] hover:bg-[#ff6a33]"
                      onClick={() => handleChooseRestaurant(restaurant)}
                    >
                      Choose {restaurant.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list">
            <div className="space-y-4">
              {availableRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center bg-white rounded-lg shadow-md p-6">
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="ml-6 flex-grow">
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                    <p className="text-gray-600">{restaurant.cuisine}</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-4">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span>Min. Order: ₹{restaurant.minOrder}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="bg-[#FF8A0D] hover:bg-[#ff6a33]"
                    onClick={() => handleChooseRestaurant(restaurant)}
                  >
                    Choose
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

