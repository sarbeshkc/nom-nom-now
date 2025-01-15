export function Services() {
    const services = [
      {
        title: 'Caterings',
        description: 'Perfect for any occasion, our catering brings delicious food and flawless service to your venue.'
      },
      {
        title: 'Birthdays',
        description: 'Celebrate your special day with custom menus, delightful cakes, and a truly unforgettable experience.'
      },
      {
        title: 'Group Dining',
        description: 'Enjoy meaningful moments with friends or family through crafted menus and a welcoming group dining atmosphere.'
      },
      {
        title: 'Events',
        description: 'Make every event memorable with seamless planning, exceptional food, and outstanding service for all guests.'
      }
    ]
  
    return (
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Experience one-of-a-kind services for your events.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.title} className="flex flex-col">
                <div className="aspect-square bg-gray-100 rounded-lg mb-6" />
                <h3 className="text-xl font-semibold mb-3 text-[#FF4D00]">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  