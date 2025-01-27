import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, CreditCard, MapPin, Clock, ChevronRight, Menu, Plus, Check, Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { Footer } from "@/components/Footer"

const steps = [
  {
    icon: Search,
    title: "Browse Menu",
    description: "Explore our wide selection of dishes from various restaurants",
    color: "bg-blue-500",
  },
  {
    icon: Plus,
    title: "Add to Cart",
    description: "Select your favorite items and customize as needed",
    color: "bg-green-500",
  },
  {
    icon: MapPin,
    title: "Delivery Details",
    description: "Provide your delivery address and special instructions",
    color: "bg-purple-500",
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Choose your preferred payment method",
    color: "bg-orange-500",
  },
  {
    icon: Truck,
    title: "Track Order",
    description: "Follow your order's journey in real-time",
    color: "bg-pink-500",
  },
]

const features = [
  {
    icon: Clock,
    title: "Quick Delivery",
    description: "Get your food delivered within 30 minutes",
  },
  {
    icon: Menu,
    title: "Wide Selection",
    description: "Choose from hundreds of restaurants and cuisines",
  },
  {
    icon: ShoppingCart,
    title: "Easy Ordering",
    description: "Simple and intuitive ordering process",
  },
  {
    icon: Check,
    title: "Real-time Updates",
    description: "Track your order status instantly",
  },
]

const HowToOrderPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/placeholder.svg" alt="Food delivery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative text-center text-white z-10">
            <motion.h1
              className="text-5xl font-bold mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              How to Order
            </motion.h1>
            <motion.p
              className="text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your favorite food is just a few clicks away
            </motion.p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid gap-8 md:grid-cols-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {steps.map((step, index) => (
                <motion.div key={step.title} className="relative" variants={itemVariants}>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mb-4`}
                    >
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img src="/placeholder.svg" alt="Order demo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                  <div className="p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Watch How It Works</h2>
                    <p className="text-lg mb-6">See our ordering process in action</p>
                    <Button className="bg-white text-black hover:bg-white/90">Watch Demo</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid md:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-[#FF4500]/10 rounded-full flex items-center justify-center text-[#FF4500] mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
            <p className="text-gray-600 mb-8">Start exploring our delicious menu now</p>
            <Link to="/menu">
              <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white px-8 py-6 text-lg h-auto">
                Browse Menu
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HowToOrderPage

