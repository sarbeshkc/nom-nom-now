import { Button } from '@/components/ui/button'

export function DeliveringHappiness() {
  const contactInfo = [
    {
      label: 'Phone',
      value: '9847674034, 9845170932'
    },
    {
      label: 'Email',
      value: 'nomnomnow@restaurant.com'
    },
    {
      label: 'Address',
      value: 'Kathmandu University Road, Kavre, Nepal'
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-8" />
            <div className="bg-[#ff6a33] rounded-lg p-8 text-white">
              <h3 className="text-2xl font-semibold mb-6">Come and visit us</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Delivering Happiness in a Nom Nom Minute!
            </h2>
            <p className="text-gray-600 mb-6">
              At Nom Nom Now, we bring your cravings to life with the freshest flavors, delivered straight to your doorstep in no time. From breakfast delights to indulgent desserts, our menu caters to every craving with precision and care.
            </p>
            <p className="text-gray-600 mb-8">
              Planning a special dining experience? With our simple reservation feature, securing your table is effortless and convenient. At Nom Nom Now, food is more than a meal—it's an experience to cherish. Redefine dining and delivery with us, one craving at a time.
            </p>
            <Button className="bg-[#ff6a33] hover:bg-[#FF8A0D] text-white px-8">
              More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

