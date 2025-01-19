export function TeamSection() {
    const team = [
      { name: 'Sarbesh KC', role: 'Member' },
      { name: 'Aryan Koju', role: 'Member' },
      { name: 'Shreyan Wasti', role: 'Member' },
      { name: 'Shreyash Mahato', role: 'Member' }
    ]
  
    return (
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 relative">
                <div className="w-full h-full bg-gray-200 rounded-lg transform rotate-3" />
                <div className="absolute inset-0 bg-[#FF4D00]/10 rounded-lg -rotate-3" />
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  