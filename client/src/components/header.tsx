import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Nom Nom Now
        </Link>
        <nav className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-gray-800 hover:text-gray-600">Home</Link>
          <Link to="/menu" className="text-gray-800 hover:text-gray-600">Menu</Link>
          <Link to="/order" className="text-gray-800 hover:text-gray-600">Order Track</Link>
          <Link to="/reservation" className="text-gray-800 hover:text-gray-600">Reservation</Link>
          <Link to="/contact" className="text-gray-800 hover:text-gray-600">Contact Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-800">
            Sign In
          </Button>
          <Button className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white">
            Order Now
          </Button>
        </div>
      </div>
    </header>
  )
}