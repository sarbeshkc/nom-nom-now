'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const menuCategories = [
  'Special Foods',
  'Italian',
  'Mexican',
  'Drinks',
  'Lunch',
  'More Items +'
]

const menuItems = [
  {
    id: 1,
    name: 'American Chowpsey',
    image: '/placeholder.svg?height=200&width=200',
    price: 320,
    category: 'Special Foods',
    distance: 1.2
  },
  {
    id: 2,
    name: 'Veg Chowmein',
    image: '/placeholder.svg?height=200&width=200',
    price: 120,
    category: 'Special Foods',
    distance: 0.8
  },
  {
    id: 3,
    name: 'Chicken Sekuwa',
    image: '/placeholder.svg?height=200&width=200',
    price: 180,
    category: 'Special Foods',
    distance: 2.1
  },
  {
    id: 4,
    name: 'Braciole',
    image: '/placeholder.svg?height=200&width=200',
    price: 290,
    category: 'Italian',
    distance: 1.5
  },
  {
    id: 5,
    name: 'Pasta with tomato sauce',
    image: '/placeholder.svg?height=200&width=200',
    price: 320,
    category: 'Italian',
    distance: 1.7
  },
  {
    id: 6,
    name: 'Fish Curry',
    image: '/placeholder.svg?height=200&width=200',
    price: 310,
    category: 'Lunch',
    distance: 0.5
  },
  {
    id: 7,
    name: 'Chicken Nuggets',
    image: '/placeholder.svg?height=200&width=200',
    price: 350,
    category: 'Special Foods',
    distance: 1.9
  },
  {
    id: 8,
    name: 'Buff Tacos',
    image: '/placeholder.svg?height=200&width=200',
    price: 320,
    category: 'Mexican',
    distance: 2.3
  },
  {
    id: 9,
    name: 'French Fries',
    image: '/placeholder.svg?height=200&width=200',
    price: 190,
    category: 'Special Foods',
    distance: 0.7
  },
  {
    id: 10,
    name: 'Chicken Lollipops',
    image: '/placeholder.svg?height=200&width=200',
    price: 420,
    category: 'Special Foods',
    distance: 1.4
  },
  {
    id: 11,
    name: 'Mexican Quesadilla',
    image: '/placeholder.svg?height=200&width=200',
    price: 375,
    category: 'Mexican',
    distance: 1.6
  },
  {
    id: 12,
    name: 'Yomari with sweets',
    image: '/placeholder.svg?height=200&width=200',
    price: 180,
    category: 'Special Foods',
    distance: 2.0
  }
]

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'distance':
          return a.distance - b.distance
        default:
          return 0
      }
    })

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative h-[300px] mb-12">
          <div className="absolute inset-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-15%20140458-zEGC89HyElf1GHHHVHtELpMzAcsk4H.png"
              alt="Pizza"
              className="w-full h-full object-cover rounded-b-3xl"
            />
            <div className="absolute inset-0 bg-black/50 rounded-b-3xl" />
          </div>
          <div className="relative h-full flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Order Food Online!
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-6">
          {/* Search and Sort Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for dishes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categories */}
          <h2 className="text-3xl font-bold mb-6">Our Regular Menu Pack</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory('all')}
            >
              All Items
            </Button>
            {menuCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#FF4D00]">Rs.{item.price}</span>
                  <Button
                    size="sm"
                    className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white"
                  >
                    Add To Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

