// client/src/pages/restaurant/registration.tsx

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { RestaurantRegistrationForm } from '../../components/restaurant/regestration-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function RestaurantRegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Partner with Nom Nom Now
            </h1>
            
            <Alert className="mb-8">
              <Package className="h-4 w-4" />
              <AlertDescription>
                Join our platform to reach more customers and grow your business. Complete the form below to start your registration process.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="pt-6">
                <RestaurantRegistrationForm />
              </CardContent>
            </Card>

            <div className="mt-8 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Registration Process</h2>
                <div className="space-y-4 text-gray-600">
                  <p>1. Fill out the registration form with your restaurant details</p>
                  <p>2. Submit required documentation for verification</p>
                  <p>3. Our team will review your application</p>
                  <p>4. Once approved, set up your menu and delivery preferences</p>
                  <p>5. Start receiving orders through Nom Nom Now</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Benefits of Partnering</h2>
                <div className="space-y-4 text-gray-600">
                  <p>- Increased visibility to thousands of potential customers</p>
                  <p>- Real-time order management system</p>
                  <p>- Delivery network and logistics support</p>
                  <p>- Analytics and insights to grow your business</p>
                  <p>- 24/7 partner support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}