'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { Cart } from '../../components/cart'
import { CartProvider, useCart } from "../../contexts/cart-context"
//import Image from 'next/image'

const categories = [
  "Special Foods",
  "Italian",
  "Mexican",
  "Drinks",
  "Lunch",
]

const allMenuItems = [
  {
    name: "American Choupsey",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 2.5
  },
  {
    name: "Veg Chowmein",
    price: 120,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.8
  },
  {
    name: "Chicken Sekuwa",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 3.2
  },
  {
    name: "Braciole",
    price: 290,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 4.1
  },
  {
    name: "Pasta with tomato sauce",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 2.7
  },
  {
    name: "Fish Curry",
    price: 310,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.5
  },
  {
    name: "Chicken Nuggets",
    price: 350,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.0
  },
  {
    name: "Buff Tacos",
    price: 320,
    image: "/placeholder.svg?height=200&width=200",
    category: "Mexican",
    distance: 3.5
  },
  {
    name: "French Fries",
    price: 190,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.2
  },
  {
    name: "Chicken Lollipops",
    price: 420,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 2.8
  },
  {
    name: "Mexican Quesadilla",
    price: 375,
    image: "/placeholder.svg?height=200&width=200",
    category: "Mexican",
    distance: 3.9
  },
  {
    name: "Yomari with sweets",
    price: 180,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 4.5
  },
  {
    name: "Butter Chicken",
    price: 450,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.3
  },
  {
    name: "Margherita Pizza",
    price: 550,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 3.0
  },
  {
    name: "Chicken Biryani",
    price: 380,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.6
  },
  {
    name: "Grilled Fish",
    price: 520,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 3.7
  },
  {
    name: "Vegetable Spring Rolls",
    price: 220,
    image: "/placeholder.svg?height=200&width=200",
    category: "Special Foods",
    distance: 1.9
  },
  {
    name: "Mushroom Risotto",
    price: 420,
    image: "/placeholder.svg?height=200&width=200",
    category: "Italian",
    distance: 4.2
  },
  {
    name: "Caesar Salad",
    price: 280,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 2.1
  },
  {
    name: "Beef Burger",
    price: 340,
    image: "/placeholder.svg?height=200&width=200",
    category: "Lunch",
    distance: 1.7
  },
  {
    name: "Margarita",
    price: 280,
    image: "/placeholder.svg?height=200&width=200",
    category: "Drinks",
    distance: 3.3
  },
  {
    name: "Mojito",
    price: 260,
    image: "/placeholder.svg?height=200&width=200",
    category: "Drinks",
    distance: 3.6
  }
]

const restaurants = [
  {
    name: "KFC",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Crispy fried chicken served fast, fresh, and irresistibly delicious."
  },
  {
    name: "Domino's",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Satisfy your pizza cravings with fresh, hot, and cheesy flavors."
  },
  {
    name: "Roadhouse Cafe",
    logo: "/placeholder.svg?height=100&width=100",
    image: "/placeholder.svg?height=200&width=200",
    description: "Known for wood-fired pizzas and a cozy cafe experience."
  }
]

function MenuPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [selectedCategory, setSelectedCategory] = useState('Special Foods')
  const [showAllItems, setShowAllItems] = useState(false)
  const [cartVisible, setCartVisible] = useState(false) 
  const { addItem } = useCart()

  const filteredAndSortedItems = useMemo(() => {
    let items = allMenuItems

    // Filter by category if not showing all items
    if (!showAllItems) {
      items = items.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) || 
        item.category.toLowerCase().includes(lowercaseQuery)
      )
    }

    // Sort items
    switch (sortBy) {
      case 'price_low':
        return items.sort((a, b) => a.price - b.price)
      case 'price_high':
        return items.sort((a, b) => b.price - a.price)
      case 'distance':
        return items.sort((a, b) => a.distance - b.distance)
      default:
        return items
    }
  }, [selectedCategory, searchQuery, sortBy, showAllItems])

  const handleAddToCart = (item: typeof allMenuItems[0]) => {
    addItem({
      id: item.name,
      name: item.name,
      price: item.price,
      image: item.image
    })
    setCartVisible(true) 
  }

  return (
    <div className="min-h-screen flex">
      <Header/>
      <div className={cartVisible ? "w-[70%]" : "w-full"}> 
        {/* <Header /> */}
        
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-[#FF4500] py-16 px-12">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">
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
              <h2 className="text-2xl font-bold">Our Regular Menu Pack</h2>
              <Button
                variant="ghost"
                className="text-[#FF4500] hover:text-[#FF4500]/90"
                onClick={() => setShowAllItems(!showAllItems)}
              >
                {showAllItems ? 'Show Less' : 'View All'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-[#FF4500] hover:bg-[#FF4500]/90" : ""}
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
              {filteredAndSortedItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-4 border hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                    {/* <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    /> */}
                  </div>
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF4500] font-medium">₹{item.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">{item.distance.toFixed(1)} km</span>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-[#FF4500] hover:bg-[#FF4500]/90"
                    onClick={() => handleAddToCart(item)}
                  >
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
                      {/* <Image
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      /> */}
                    </div>
                    <div className="h-12 mb-4">
                      {/* <Image
                        src={restaurant.logo || "/placeholder.svg"}
                        alt={`${restaurant.name} logo`}
                        width={100}
                        height={48}
                        className="h-full w-auto object-contain"
                      /> */}
                    </div>
                    <p className="text-gray-600 mb-4">{restaurant.description}</p>
                    <Button className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90">
                      Order Now
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <Footer/>
        </main>
      </div>

      {cartVisible && ( 
        <aside className="w-[30%] sticky top-0 h-screen">
          <Cart onClose={() => setCartVisible(false)} />
        </aside>
      )}
    </div>
  )
}

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuPageContent />
    </CartProvider>
  )
}

