// server/src/models/restaurant.model.ts

type BusinessHours = {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  
  type DeliveryArea = {
    radius: number;
    city: string;
    province: string;
  };
  
  type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl?: string;
  };
  
  type RestaurantStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  
  export interface Restaurant {
    id: string;
    userId: string; // Reference to the owner's user account
    businessName: string;
    businessRegistrationNumber?: string;
    ownerName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address: {
      street: string;
      city: string;
      province: string;
      postalCode?: string;
      location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
      };
    };
    description: string;
    cuisineTypes: string[];
    businessHours: BusinessHours;
    deliveryAreas: DeliveryArea[];
    menu: MenuItem[];
    minimumOrder: number;
    averagePreparationTime: number;
    status: RestaurantStatus;
    isOpen: boolean;
    rating: number;
    totalRatings: number;
    createdAt: Date;
    updatedAt: Date;
    documents: {
      businessLicense?: string;
      foodSafetyCertificate?: string;
      ownerIdentification?: string;
    };
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch: string;
    };
  }
}