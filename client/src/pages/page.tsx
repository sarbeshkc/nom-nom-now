import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { MenuBrowse } from '@/components/menu-browse'
import { DeliveringHappiness } from '@/components/delivering-happiness'
import { Services } from '@/components/services'
import { FastestDelivery } from '@/components/fastest-delivery'
import { Testimonials } from '@/components/testimonials'
import { PartnerWithUs } from '@/components/partner-with-us'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <MenuBrowse />
      <DeliveringHappiness />
      <Services />
      <FastestDelivery />
      <Testimonials />
      <PartnerWithUs />
      <Footer />
    </main>
  )
}

