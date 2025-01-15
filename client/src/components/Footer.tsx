import { Link } from 'react-router-dom'
import { Twitter, Facebook, Instagram, Github } from 'lucide-react'

export function Footer() {
  const services = [
    { name: 'Pre-Reservation', href: '/reservation' },
    { name: 'Order Online', href: '/order' },
    { name: 'Foodie Place', href: '/foodie-place' },
    { name: '24/7 Services', href: '/services' },
    { name: 'Super Chefs', href: '/chefs' },
  ]

  const about = [
    { name: 'About Us', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Delivery Charges', href: '/delivery-charges' },
    { name: 'Available Areas', href: '/areas' },
  ]

  const help = [
    { name: 'How To Order?', href: '/how-to-order' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
  ]

  return (
    <footer className="bg-[#FF4D00] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <img
            src="/placeholder.svg"
            alt="Nom Nom Now"
            className="h-12 w-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white/80">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">About</h3>
            <ul className="space-y-2">
              {about.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white/80">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Get Help</h3>
            <ul className="space-y-2">
              {help.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white/80">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-2">
              <p>Dhulikhel: 011907869, 9862990399, 9847674034</p>
              <p>Kathmandu: 014345739, 9845170932, 9866000596</p>
            </div>
            <div className="mt-6">
              <h4 className="text-xl font-bold mb-4">Social Links</h4>
              <div className="flex space-x-4">
                <Link to="#" className="bg-black/20 p-2 rounded-full hover:bg-black/30">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link to="#" className="bg-black/20 p-2 rounded-full hover:bg-black/30">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link to="#" className="bg-black/20 p-2 rounded-full hover:bg-black/30">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link to="#" className="bg-black/20 p-2 rounded-full hover:bg-black/30">
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center">
          <p>Copyright © 2024 Nom Nom Now. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}