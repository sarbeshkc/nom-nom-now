import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { FaCoffee, FaDrumstickBite, FaGlassMartiniAlt, FaIceCream } from 'react-icons/fa'

export function MenuBrowse() {
  const categories = [
    {
      title: 'Breakfast',
      description: 'Start your day with energy and flavor—pancakes, omelets, and more to fuel your morning',
      link: '/menu/breakfast',
      icon: FaCoffee
    },
    {
      title: 'Main Dishes',
      description: 'Enjoy a perfect blend of taste and tradition with grilled specialties, and satisfying mains',
      link: '/menu/main-dishes',
      icon: FaDrumstickBite
    },
    {
      title: 'Drinks',
      description: 'Refresh and recharge with a vibrant mix of juices, specialty coffees, and crafted mocktails',
      link: '/menu/drinks',
      icon: FaGlassMartiniAlt
    },
    {
      title: 'Desserts',
      description: 'End on a sweet note with decadent cakes, creamy and delightful pastries',
      link: '/menu/desserts',
      icon: FaIceCream
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Browse Our Menu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Card key={category.title} className="border border-gray-200 rounded-lg">
              <CardContent className="p-8 text-center">
                <category.icon className="w-16 h-16 text-[#FF4D00] mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                <Link
                  to={category.link}
                  className="text-[#FF4D00] hover:text-[#ff6a33] font-medium block"
                >
                  Explore Menu
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
