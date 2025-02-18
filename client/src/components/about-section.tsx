export function AboutSection() {
  return (
    <section className="mb-24 bg-gray-50 p-8 rounded-lg shadow-lg">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-[#FF4D00] mb-12">
        About Us
      </h1>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            At Nom Nom Now, we're passionate about connecting people with their favorite flavors. 
            Our mission is to provide fast delivery and convenient table reservations, making dining 
            experiences seamless and enjoyable.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            From local delicacies to international cuisines, we bring the best of Kavre's culinary 
            scene right to your doorstep.
          </p>
        </div>
        <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <img 
            src="/abtus.png" // Update with the actual path to your image
            alt="About Us" 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  )
}