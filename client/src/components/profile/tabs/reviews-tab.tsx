import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import api from '@/services/api'

interface Review {
  id: string
  restaurantName: string
  rating: number
  comment: string
  date: string
}

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/user/reviews')
        setReviews(response.data)
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      }
    }

    fetchReviews()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
        <CardDescription>
          Your reviews and ratings for restaurants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{review.restaurantName}</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {review.comment}
              </p>
              <p className="text-gray-400 text-xs">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No reviews yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
