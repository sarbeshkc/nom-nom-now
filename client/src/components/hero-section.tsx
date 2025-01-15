import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
        <div className="max-w-3xl text-white pt-16">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            From Craving To Doorstep, In a Nom Nom Minute
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed max-w-2xl">
            Craving something delicious? From sizzling dishes to fresh flavors, we deliver straight to your door or help you reserve the perfect table—fast, easy, and irresistible!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white px-8 py-6 text-lg rounded-md"
            >
              Order Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md"
            >
              Explore Menu
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

