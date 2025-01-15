export function ContactTestimonials() {
    const testimonials = [
      {
        name: 'Sita Thapa',
        feedback: 'Amazing service! The food arrived hot and fresh. Nom Nom Now never disappoints!'
      },
      {
        name: 'Raj Kumar',
        feedback: 'The table reservation system is so convenient. Great food and excellent service!'
      },
      {
        name: 'Anita Singh',
        feedback: 'Best food delivery in Kavre! Quick, reliable, and always delicious.'
      }
    ]
  
    return (
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="w-full h-full bg-gray-200 rounded-full" />
                <div className="absolute inset-0 border-2 border-[#FF4D00] rounded-full transform translate-x-1 translate-y-1" />
              </div>
              <h3 className="text-center font-semibold mb-2">{testimonial.name}</h3>
              <p className="text-center text-gray-600">{testimonial.feedback}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  