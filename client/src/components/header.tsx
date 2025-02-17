import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../public/logo-1.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
      style={{ height: '80px' }} // Set the height here
    >
      <div className="container mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logoImage} 
              alt="Nom Nom Now Logo" 
              className="w-20 h-20 rounded-xl shadow-lg" // Increased size
            />
            <span className="text-2xl font-bold text-gray-800">Nom Nom Now</span> {/* Increased font size */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {['Home', 'Menu', 'Order Track', 'Reservation', 'Contact Us'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-orange-500 after:transition-all after:duration-300"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/order')}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium 
                shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 
                hover:scale-105 transition-all duration-300 
                flex items-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Order Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {['Home', 'Menu', 'Order Track', 'Reservation', 'Contact Us'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(' ', '')}`}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium py-2 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium text-left"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('/order');
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium 
                    shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 
                    transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}