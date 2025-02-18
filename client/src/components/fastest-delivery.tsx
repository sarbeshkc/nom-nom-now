export function FastestDelivery() {
  const features = [
    "Delivery within 30 minutes",
    "Best Offer & Prices",
    "Online Services Available",
    "Clean Kitchen",
    "Pre-Reservation"
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            {/* Main featured image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img 
                src="/ness.png" 
                alt="Fast delivery"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Secondary images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                src="/deliver.png"
                  alt="Fresh ingredients"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="happy.png"
                  alt="Happy customer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Fastest Food Delivery in City
            </h2>
            <p className="text-gray-600 mb-8">
              Our visual designer lets you quickly and of drag a down your way to customapps for both keep desktop.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}