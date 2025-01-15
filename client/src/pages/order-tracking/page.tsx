import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { OrderDetails } from '@/components/order-details'
import { LiveTracking } from '@/components/live-tracking'

export default function OrderTrackingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#FFF5F2] to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
          <p className="text-gray-600 mb-8">Order ID: #NOM123456</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <OrderDetails />
            <LiveTracking />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

