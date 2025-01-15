'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  return (
    <section className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">Get in Touch</h2>
      <p className="text-center text-gray-600 mb-8">
        We value your thoughts and feedback! Have questions or suggestions? Let us know through the form below.
      </p>
      <form className="space-y-6">
        <div>
          <Input 
            placeholder="Your Name" 
            className="bg-white border-gray-200"
          />
        </div>
        <div>
          <Input 
            type="email" 
            placeholder="Email Address" 
            className="bg-white border-gray-200"
          />
        </div>
        <div>
          <Textarea 
            placeholder="Your Message" 
            className="bg-white border-gray-200 min-h-[150px]"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#FF4D00] hover:bg-[#ff6a33] text-white"
        >
          Send Message
        </Button>
      </form>
    </section>
  )
}

