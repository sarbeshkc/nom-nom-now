import { Calendar, Clock, Star, Users } from 'lucide-react'

export function ReservationFeatures() {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Reservations',
      description: 'Book your table in just a few clicks with our simple reservation system'
    },
    {
      icon: Star,
      title: 'Top Restaurants',
      description: 'Choose from our carefully selected collection of premium dining venues'
    },
    {
      icon: Clock,
      title: 'No Waiting',
      description: 'Skip the queue and get instant confirmation for your reservation'
    },
    {
      icon: Users,
      title: 'Group Bookings',
      description: 'Easily arrange dining for large groups and special occasions'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {features.map((feature) => (
        <div 
          key={feature.title} 
          className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF4D00]/10 text-[#FF4D00] mb-4">
            <feature.icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

