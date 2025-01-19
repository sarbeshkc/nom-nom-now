const teamMembers = [
    { name: 'Sarbesh KC', role: 'Member' },
    { name: 'Aryan Koju', role: 'Member' },
    { name: 'Shreyan Wasti', role: 'Member' },
    { name: 'Shreyash Mahato', role: 'Member' },
  ]
  
  export function OurTeam() {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 mx-auto" />
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  