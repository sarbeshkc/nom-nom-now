import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function PartnerWithUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#FF4D00] font-script text-3xl">Join Us</span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              PARTNER FOR SHARED SUCCESS
            </h2>
            <p className="text-gray-600 text-lg">
              Join us as a partner and expand your reach in the culinary world. Showcase your 
              delicious creations to a broader audience through our platform.
            </p>
            <Button 
              className="bg-[#ff6a33] hover:bg-[#FF8A0D] text-white px-8 py-6 text-lg h-auto"
            >
              Join Now
            </Button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Got a Restaurant?
            </h3>
            <p className="text-gray-600">
              Join us as a partner and expand your reach in the culinary world. Showcase 
              your delicious creations to a broader audience through our platform.
            </p>
            <div className="aspect-[2/1] bg-gray-200 rounded-2xl overflow-hidden" />
            <Link
              to="/partner"
              className="text-[#FF4D00] hover:text-[#ff6a33] font-medium inline-block"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}