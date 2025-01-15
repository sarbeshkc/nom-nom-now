// src/pages/auth/CustomerSignupPage.tsx
import React from 'react';
import { CustomerSignup } from '@/components/auth/CustomerAuth';

export default function CustomerSignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Join Nom Nom Now</h1>
        <p className="text-muted-foreground">
          Create your account to start ordering delicious food from your favorite restaurants
        </p>
      </div>
      <CustomerSignup />
    </div>
  );
}
