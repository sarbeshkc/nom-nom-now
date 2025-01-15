import { Card, CardContent } from '@/components/ui/card'

export function Testimonials() {
  const testimonials = [
    {
      quote: "The best restaurant",
      text: "Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles.",
      author: "Sophire Robson",
      location: "Los Angeles, CA"
    },
    {
      quote: "Simply delicious",
      text: "Place exceeded my expectations on all fronts. The ambiance was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.",
      author: "Matt Cannon",
      location: "San Diego, CA"
    },
    {
      quote: "One of a kind restaurant",
      text: "The culinary experience at place is first to none. The atmosphere is vibrant, the food - nothing short of extraordinary. The food was the highlight of our evening. Highly recommended.",
      author: "Andy Smith",
      location: "San Francisco, CA"
    }
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="bg-gray-50 border-none">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-[#FF4D00]">
                  "{testimonial.quote}"
                </h3>
                <p className="text-gray-600 mb-6">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

