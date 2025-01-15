import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { ReservationForm } from '@/components/reservation-form'
import { ReservationFeatures } from '@/components/reservation-features'

export default function ReservationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#FF4D00]/10 to-transparent" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#FF4D00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#FF4D00]/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reserve Your Table
            </h1>
            <p className="text-gray-600 text-lg">
              Book your perfect dining experience at your favorite restaurant. Quick, easy, and hassle-free reservations.
            </p>
          </div>
          <ReservationForm />
          <ReservationFeatures />
        </div>
      </main>
      <Footer />
    </>
  )
}

