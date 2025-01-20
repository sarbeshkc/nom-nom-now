'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export function ReservationForm() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const restaurants = [
    { id: 1, name: 'The Fine Diner' },
    { id: 2, name: 'Spice Garden' },
    { id: 3, name: 'Ocean Breeze' },
    { id: 4, name: 'Mountain View Restaurant' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <Card className="max-w-2xl mx-auto mb-16 shadow-lg">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant">Select Restaurant</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#ff6a33] hover:bg-[#ff780b] text-white py-6 text-lg h-auto"
          >
            Reserve Now
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

