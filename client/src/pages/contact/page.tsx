import { Header } from '@/components/header'
import { Footer } from '@/components/Footer'
import { AboutSection } from '@/components/about-section'
import { ContactTestimonials } from '@/components/contact-testimonials'
import { TeamSection } from '@/components/team-section'
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#FFF5F2] to-white">
        <div className="container mx-auto px-6">
          <AboutSection />
          <ContactTestimonials />
          <TeamSection />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

