"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"
import { CartDrawer } from "@/components/cart-drawer"
import { useCartStore } from "@/store/cart-store"
//import Image from "next/image"

const categories = ["Special Foods", "Italian", "Mexican", "Drinks", "Lunch"]

const allMenuItems = [
  {
    id: 1,
    name: "American Choupsey",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 2.5,
  },
  {
    id: 2,
    name: "Veg Chowmein",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.8,
  },
  {
    id: 3,
    name: "Chicken Sekuwa",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 3.2,
  },
  {
    id: 4,
    name: "Braciole",
    price: 290,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 4.1,
  },
  {
    id: 5,
    name: "Pasta with tomato sauce",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 2.7,
  },
  {
    id: 6,
    name: "Fish Curry",
    price: 310,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.5,
  },
  {
    id: 7,
    name: "Chicken Nuggets",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.0,
  },
  {
    id: 8,
    name: "Buff Tacos",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Mexican",
    distance: 3.5,
  },
  {
    id: 9,
    name: "French Fries",
    price: 190,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.2,
  },
  {
    id: 10,
    name: "Chicken Lollipops",
    price: 420,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 2.8,
  },
  {
    id: 11,
    name: "Mexican Quesadilla",
    price: 375,
    image: "/placeholder.svg?height=200&width=200",
    category: "Mexican",
    distance: 3.9,
  },
  {
    id: 12,
    name: "Yomari with sweets",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 4.5,
  },
  {
    id: 13,
    name: "Butter Chicken",
    price: 450,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.3,
  },
  {
    id: 14,
    name: "Margherita Pizza",
    price: 550,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 3.0,
  },
  {
    id: 15,
    name: "Chicken Biryani",
    price: 380,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.6,
  },
  {
    id: 16,
    name: "Grilled Fish",
    price: 520,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 3.7,
  },
  {
    id: 17,
    name: "Vegetable Spring Rolls",
    price: 220,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 1.9,
  },
  {
    id: 18,
    name: "Mushroom Risotto",
    price: 420,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 4.2,
  },
  {
    id: 19,
    name: "Caesar Salad",
    price: 280,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.1,
  },
  {
    id: 20,
    name: "Beef Burger",
    price: 340,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.7,
  },
  {
    id: 21,
    name: "Margarita",
    price: 280,
    image: "/placeholder.svg?height=200&width=200",
    category: "Drinks",
    distance: 3.3,
  },
  {
    id: 22,
    name: "Mojito",
    price: 260,
    image: "/placeholder.svg?height=200&width=200",
    category: "Drinks",
    distance: 3.6,
  },
]

const restaurants = [
  {
    name: "KFC",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Crispy fried chicken served fast, fresh, and irresistibly delicious.",
  },
  {
    name: "Domino's",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Satisfy your pizza cravings with fresh, hot, and cheesy flavors.",
  },
  {
    name: "Roadhouse Cafe",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Known for wood-fired pizzas and a cozy cafe experience.",
  },
]

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [selectedCategory, setSelectedCategory] = useState("Special Foods")
  const [showAllItems, setShowAllItems] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)

  const filteredAndSortedItems = useMemo(() => {
    let items = allMenuItems

    // Filter by category if not showing all items
    if (!showAllItems) {
      items = items.filter((item) => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseQuery) || item.category.toLowerCase().includes(lowercaseQuery),
      )
    }

    // Sort items
    switch (sortBy) {
      case "price_low":
        return items.sort((a, b) => a.price - b.price)
      case "price_high":
        return items.sort((a, b) => b.price - a.price)
      case "distance":
        return items.sort((a, b) => a.distance - b.distance)
      default:
        return items
    }
  }, [selectedCategory, searchQuery, sortBy, showAllItems])

  const handleAddToCart = (item: (typeof allMenuItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.category,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#FF8A0D] py-16 px-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-white mb-1">
              You have a bad meal.
              <br />
              Just eat good food
            </h1>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Search and Sort Section */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="What would you like to eat today?"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Menu Categories */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold">Our Regular Menu Pack</h2>
            <Button
              variant="ghost"
              className="text-[#FF8A0D] hover:text-[#FF8A0D]/90"
              onClick={() => setShowAllItems(!showAllItems)}
            >
              {showAllItems ? "Show Less" : "View All"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-[#FF8A0D] hover:bg-[#ff6a33]/90" : ""}
                onClick={() => {
                  setSelectedCategory(category)
                  setShowAllItems(false)
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAndSortedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#58B55F] font-medium">₹{item.price.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm">{item.distance.toFixed(1)} km</span>
                </div>
                <Button className="w-full mt-4 bg-[#FF8A0D] hover:bg-[#ff6a33]" onClick={() => handleAddToCart(item)}>
                  Add To Cart
                </Button>
              </div>
            ))}
          </div>

          {/* Favorite Restaurants Section */}
          <section className="mb-16">
            <h2 className="text-4xl font-bold mb-8">Order from Your Favorite Restaurants</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="h-12 mb-4">
                    <img
                      src={restaurant.logo || "/placeholder.svg"}
                      alt={`${restaurant.name} logo`}
                      width={100}
                      height={48}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  <Button className="w-full bg-[#FF8A0D] hover:bg-[#FF4500]/90">Order Now</Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

