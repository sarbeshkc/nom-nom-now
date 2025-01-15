export function AboutSection() {
    return (
      <section className="mb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#FF4D00] mb-16">
          About Us
        </h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              At Nom Nom Now, we're passionate about connecting people with their favorite flavors. 
              Our mission is to provide fast delivery and convenient table reservations, making dining 
              experiences seamless and enjoyable.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From local delicacies to international cuisines, we bring the best of Kavre's culinary 
              scene right to your doorstep.
            </p>
          </div>
          <div className="aspect-[4/3] bg-gray-100 rounded-lg" />
        </div>
      </section>
    )
  }
  
  