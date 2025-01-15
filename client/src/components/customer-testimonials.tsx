import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Sarah L.',
    feedback: 'Nom Nom Now has made ordering food so convenient! The delivery is always on time, and the food arrives hot and fresh.',
  },
  {
    name: 'Rajesh K.',
    feedback: 'I love using Nom Nom Now for restaurant reservations. It is quick, easy, and has never let me down.',
  },
  {
    name: 'Emily W.',
    feedback: 'The variety of restaurants available on Nom Nom Now is impressive. I have discovered so many new favorite places!',
  },
]

export function CustomerTestimonials() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-center">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">{testimonial.name}</h3>
              <p className="text-gray-600">{testimonial.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

