
import { PrismaClient, RestaurantCategory } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createRestaurantWithRelations(
  userData: any,
  restaurantData: any,
  menuItems: any[],
  deliveryZone: any
) {
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: await hash(userData.password, 12)
    }
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      ...restaurantData,
      userId: user.id
    }
  });

  for (const menuItem of menuItems) {
    await prisma.menuItem.create({
      data: {
        ...menuItem,
        restaurantId: restaurant.id
      }
    });
  }

  await prisma.deliveryZone.create({
    data: {
      ...deliveryZone,
      restaurantId: restaurant.id
    }
  });

  return { user, restaurant };
}

async function main() {
  try {
    // 1. Thakali Kitchen (Fine Dining)
    await createRestaurantWithRelations(
      {
        email: 'ram@thakalikitchen.com',
        password: 'password123',
        name: 'Ram Thakali',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'Thakali Kitchen',
        businessRegistrationNumber: 'TK123456',
        ownerName: 'Ram Thakali',
        email: 'contact@thakalikitchen.com',
        phone: '9841234567',
        alternatePhone: '9867894532',
        address: {
          street: 'Thamel Marg',
          ward: 29,
          city: 'Kathmandu',
          province: 'Bagmati',
          latitude: 27.7172,
          longitude: 85.3240
        },
        description: 'Experience authentic Thakali cuisine in an elegant setting. Our traditional recipes have been passed down through generations.',
        cuisineTypes: ['Thakali', 'Nepali', 'Traditional'],
        categories: [RestaurantCategory.FINE_DINING],
        businessHours: {
          monday: { open: '10:00', close: '21:00' },
          tuesday: { open: '10:00', close: '21:00' },
          wednesday: { open: '10:00', close: '21:00' },
          thursday: { open: '10:00', close: '21:00' },
          friday: { open: '10:00', close: '22:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '21:00' }
        },
        minimumOrder: 500,
        averagePreparationTime: 30,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.7,
        totalRatings: 128,
        documents: {
          businessLicense: 'license_tk123.pdf',
          foodSafetyCertificate: 'safety_cert_tk123.pdf'
        },
        bankDetails: {
          accountName: 'Thakali Kitchen Pvt. Ltd',
          accountNumber: '0123456789',
          bankName: 'Nepal Investment Bank',
          branch: 'Thamel'
        }
      },
      [
        {
          name: 'Thakali Set',
          description: 'Traditional Thakali dal-bhat set with chicken curry',
          price: 450,
          category: 'Main Course',
          preparationTime: 20,
          isAvailable: true,
          imageUrl: '/images/thakali-set.jpg',
          customization: {
            spiceLevels: ['Mild', 'Medium', 'Hot']
          }
        },
        {
          name: 'Mutton Curry',
          description: 'Tender mutton cooked in traditional Thakali spices',
          price: 350,
          category: 'Main Course',
          preparationTime: 25,
          isAvailable: true,
          imageUrl: '/images/mutton-curry.jpg'
        }
      ],
      {
        name: 'Thamel Area',
        radius: 5,
        baseDeliveryFee: 100,
        minimumOrder: 500,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.3090, 27.7150]]
        },
        estimatedTime: 30,
        isActive: true
      }
    );

    // 2. KU Cafe (Student-friendly cafe)
    await createRestaurantWithRelations(
      {
        email: 'manager@kucafe.com',
        password: 'password123',
        name: 'Sabin Tamang',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'KU Cafe',
        businessRegistrationNumber: 'KC789012',
        ownerName: 'Sabin Tamang',
        email: 'contact@kucafe.com',
        phone: '9845678901',
        alternatePhone: '9812345678',
        address: {
          street: 'KU Road',
          ward: 1,
          city: 'Dhulikhel',
          province: 'Bagmati',
          latitude: 27.6195,
          longitude: 85.5386
        },
        description: 'Student-friendly cafe offering affordable meals and great coffee. Perfect study spot with free WiFi.',
        cuisineTypes: ['Cafe', 'Fast Food', 'Continental'],
        categories: [RestaurantCategory.CAFE],
        businessHours: {
          monday: { open: '07:00', close: '20:00' },
          tuesday: { open: '07:00', close: '20:00' },
          wednesday: { open: '07:00', close: '20:00' },
          thursday: { open: '07:00', close: '20:00' },
          friday: { open: '07:00', close: '20:00' },
          saturday: { open: '08:00', close: '18:00' },
          sunday: { open: '08:00', close: '18:00' }
        },
        minimumOrder: 200,
        averagePreparationTime: 15,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.5,
        totalRatings: 256,
        documents: {
          businessLicense: 'license_kc789.pdf',
          foodSafetyCertificate: 'safety_cert_kc789.pdf'
        },
        bankDetails: {
          accountName: 'KU Cafe Pvt. Ltd',
          accountNumber: '9876543210',
          bankName: 'NMB Bank',
          branch: 'Dhulikhel'
        }
      },
      [
        {
          name: 'Chicken Sandwich',
          description: 'Grilled chicken with fresh vegetables',
          price: 160,
          category: 'Sandwiches',
          preparationTime: 10,
          isAvailable: true,
          imageUrl: '/images/chicken-sandwich.jpg'
        },
        {
          name: 'Cappuccino',
          description: 'Freshly brewed coffee with frothy milk',
          price: 120,
          category: 'Beverages',
          preparationTime: 5,
          isAvailable: true,
          imageUrl: '/images/cappuccino.jpg'
        }
      ],
      {
        name: 'KU Area',
        radius: 2,
        baseDeliveryFee: 50,
        minimumOrder: 200,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.5386, 27.6195]]
        },
        estimatedTime: 15,
        isActive: true
      }
    );

    // 3. Banepa Momo House (Street Food)
    await createRestaurantWithRelations(
      {
        email: 'owner@banepamomo.com',
        password: 'password123',
        name: 'Sunita Shrestha',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'Banepa Momo House',
        businessRegistrationNumber: 'BM456789',
        ownerName: 'Sunita Shrestha',
        email: 'contact@banepamomo.com',
        phone: '9841234567',
        alternatePhone: null,
        address: {
          street: 'Banepa Bazaar',
          ward: 7,
          city: 'Banepa',
          province: 'Bagmati',
          latitude: 27.6290,
          longitude: 85.5211
        },
        description: 'Famous for authentic Newari-style momos and jhol momo. A local favorite for quick, delicious meals.',
        cuisineTypes: ['Street Food', 'Nepali', 'Fast Food'],
        categories: [RestaurantCategory.STREET_FOOD],
        businessHours: {
          monday: { open: '11:00', close: '20:00' },
          tuesday: { open: '11:00', close: '20:00' },
          wednesday: { open: '11:00', close: '20:00' },
          thursday: { open: '11:00', close: '20:00' },
          friday: { open: '11:00', close: '20:00' },
          saturday: { open: '11:00', close: '20:00' },
          sunday: { open: '11:00', close: '20:00' }
        },
        minimumOrder: 150,
        averagePreparationTime: 15,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.6,
        totalRatings: 412,
        documents: {
          businessLicense: 'license_bm456.pdf',
          foodSafetyCertificate: 'safety_cert_bm456.pdf'
        },
        bankDetails: {
          accountName: 'Banepa Momo House',
          accountNumber: '5432109876',
          bankName: 'Sanima Bank',
          branch: 'Banepa'
        }
      },
      [
        {
          name: 'Chicken Jhol Momo',
          description: 'Steamed momos served in spicy soup',
          price: 160,
          category: 'Momos',
          preparationTime: 15,
          isAvailable: true,
          imageUrl: '/images/jhol-momo.jpg',
          customization: {
            spiceLevels: ['Mild', 'Medium', 'Extra Spicy']
          }
        },
        {
          name: 'Buff C Momo',
          description: 'Fried buff momos tossed in spicy sauce',
          price: 140,
          category: 'Momos',
          preparationTime: 15,
          isAvailable: true,
          imageUrl: '/images/c-momo.jpg'
        }
      ],
      {
        name: 'Banepa Area',
        radius: 3,
        baseDeliveryFee: 60,
        minimumOrder: 150,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.5211, 27.6290]]
        },
        estimatedTime: 20,
        isActive: true
      }
    );

    // 4. Panauti Kitchen (Family Style)
    await createRestaurantWithRelations(
      {
        email: 'owner@panautikitchen.com',
        password: 'password123',
        name: 'Hari Prasad Adhikari',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'Panauti Kitchen',
        businessRegistrationNumber: 'PK234567',
        ownerName: 'Hari Prasad Adhikari',
        email: 'contact@panautikitchen.com',
        phone: '9845678912',
        alternatePhone: '9812345678',
        address: {
          street: 'Panauti Old Town',
          ward: 4,
          city: 'Panauti',
          province: 'Bagmati',
          latitude: 27.5847,
          longitude: 85.5146
        },
        description: 'Traditional Newari family restaurant serving authentic local cuisine. Known for our festivals and family gatherings.',
        cuisineTypes: ['Newari', 'Traditional', 'Local'],
        categories: [RestaurantCategory.FAMILY_STYLE],
        businessHours: {
          monday: { open: '11:00', close: '21:00' },
          tuesday: { open: '11:00', close: '21:00' },
          wednesday: { open: '11:00', close: '21:00' },
          thursday: { open: '11:00', close: '21:00' },
          friday: { open: '11:00', close: '22:00' },
          saturday: { open: '11:00', close: '22:00' },
          sunday: { open: '11:00', close: '21:00' }
        },
        minimumOrder: 400,
        averagePreparationTime: 25,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.8,
        totalRatings: 167,
        documents: {
          businessLicense: 'license_pk234.pdf',
          foodSafetyCertificate: 'safety_cert_pk234.pdf'
        },
        bankDetails: {
          accountName: 'Panauti Kitchen',
          accountNumber: '6789012345',
          bankName: 'Kumari Bank',
          branch: 'Panauti'
        }
      },
      [
        {
          name: 'Newari Khaja Set',
          description: 'Traditional Newari snack platter with chiura and achar',
          price: 250,
          category: 'Main Course',
          preparationTime: 20,
          isAvailable: true,
          imageUrl: '/images/newari-khaja.jpg'
        },
        {
          name: 'Choyla',
          description: 'Spicy grilled buffalo meat, Newari style',
          price: 200,
          category: 'Appetizers',
          preparationTime: 15,
          isAvailable: true,
          imageUrl: '/images/choyla.jpg'
        }
      ],
      {
        name: 'Panauti Area',
        radius: 4,
        baseDeliveryFee: 80,
        minimumOrder: 400,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.5146, 27.5847]]
        },
        estimatedTime: 25,
        isActive: true
      }
    );

    // 5. Sora Café & Bistro (Modern Fusion)
    await createRestaurantWithRelations(
      {
        email: 'manager@soracafe.com',
        password: 'password123',
        name: 'Maya Gurung',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'Sora Café & Bistro',
        businessRegistrationNumber: 'SC567890',
        ownerName: 'Maya Gurung',
        email: 'contact@soracafe.com',
        phone: '9841112233',
        alternatePhone: '9845556677',
        address: {
          street: 'Zero Kilo, Dhulikhel',
          ward: 2,
          city: 'Dhulikhel',
          province: 'Bagmati',
          latitude: 27.6215,
          longitude: 85.5472
        },
        description: 'Modern fusion café offering panoramic Himalayan views. Perfect blend of local and international flavors in a contemporary setting.',
        cuisineTypes: ['Fusion', 'Café', 'Continental', 'Asian'],
        categories: [RestaurantCategory.CAFE, RestaurantCategory.FINE_DINING],
        businessHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '21:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '08:00', close: '20:00' }
        },
        minimumOrder: 300,
        averagePreparationTime: 20,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.9,
        totalRatings: 234,
        documents: {
          businessLicense: 'license_sc567.pdf',
          foodSafetyCertificate: 'safety_cert_sc567.pdf'
        },
        bankDetails: {
          accountName: 'Sora Café Pvt. Ltd',
          accountNumber: '3456789012',
          bankName: 'Himalayan Bank',
          branch: 'Dhulikhel'
        }
      },
      [
        {
          name: 'Buddha Bowl',
          description: 'Healthy bowl with quinoa, avocado, roasted vegetables, and tofu',
          price: 420,
          category: 'Main Course',
          preparationTime: 18,
          isAvailable: true,
          imageUrl: '/images/buddha-bowl.jpg',
          customization: {
            preferences: ['Vegan', 'Gluten-Free'],
            extras: [
              { name: 'Extra Avocado', price: 80 },
              { name: 'Extra Tofu', price: 60 }
            ]
          }
        },
        {
          name: 'Mountain Sunrise Breakfast',
          description: 'Local eggs, organic bread, mushrooms, and mountain herbs',
          price: 380,
          category: 'Breakfast',
          preparationTime: 15,
          isAvailable: true,
          imageUrl: '/images/mountain-breakfast.jpg'
        }
      ],
      {
        name: 'Dhulikhel View Area',
        radius: 3,
        baseDeliveryFee: 70,
        minimumOrder: 300,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.5472, 27.6215]]
        },
        estimatedTime: 20,
        isActive: true
      }
    );

    // 6. Bhaktapur Samay Baji (Traditional Newari)
    await createRestaurantWithRelations(
      {
        email: 'owner@samaybaji.com',
        password: 'password123',
        name: 'Sujan Shakya',
        role: 'RESTAURANT_OWNER',
        emailVerified: true
      },
      {
        businessName: 'Bhaktapur Samay Baji',
        businessRegistrationNumber: 'BS789012',
        ownerName: 'Sujan Shakya',
        email: 'contact@samaybaji.com',
        phone: '9847778899',
        alternatePhone: '9841112233',
        address: {
          street: 'Taumadhi Square',
          ward: 15,
          city: 'Bhaktapur',
          province: 'Bagmati',
          latitude: 27.6710,
          longitude: 85.4298
        },
        description: 'Traditional Newari restaurant in historic Bhaktapur. Authentic Samay Baji and local delicacies served in traditional style.',
        cuisineTypes: ['Newari', 'Traditional', 'Local'],
        categories: [RestaurantCategory.FAMILY_STYLE],
        businessHours: {
          monday: { open: '11:00', close: '20:00' },
          tuesday: { open: '11:00', close: '20:00' },
          wednesday: { open: '11:00', close: '20:00' },
          thursday: { open: '11:00', close: '20:00' },
          friday: { open: '11:00', close: '21:00' },
          saturday: { open: '11:00', close: '21:00' },
          sunday: { open: '11:00', close: '20:00' }
        },
        minimumOrder: 350,
        averagePreparationTime: 25,
        status: 'APPROVED',
        isOpen: true,
        rating: 4.8,
        totalRatings: 312,
        documents: {
          businessLicense: 'license_bs789.pdf',
          foodSafetyCertificate: 'safety_cert_bs789.pdf'
        },
        bankDetails: {
          accountName: 'Bhaktapur Samay Baji',
          accountNumber: '8901234567',
          bankName: 'Nepal Bank',
          branch: 'Bhaktapur'
        }
      },
      [
        {
          name: 'Samay Baji Set',
          description: 'Traditional Newari feast with beaten rice, buffalo, egg, and various sides',
          price: 350,
          category: 'Main Course',
          preparationTime: 20,
          isAvailable: true,
          imageUrl: '/images/samay-baji.jpg',
          customization: {
            spiceLevels: ['Mild', 'Medium', 'Spicy'],
            extras: [
              { name: 'Extra Choyla', price: 100 },
              { name: 'Extra Achar', price: 50 }
            ]
          }
        },
        {
          name: 'Wo (Lentil Cake)',
          description: 'Traditional Newari lentil pancake served with spicy sauce',
          price: 120,
          category: 'Appetizers',
          preparationTime: 15,
          isAvailable: true,
          imageUrl: '/images/wo.jpg'
        }
      ],
      {
        name: 'Bhaktapur Durbar Area',
        radius: 2.5,
        baseDeliveryFee: 90,
        minimumOrder: 350,
        boundaries: {
          type: 'Polygon',
          coordinates: [[85.4298, 27.6710]]
        },
        estimatedTime: 30,
        isActive: true
      }
    );

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });