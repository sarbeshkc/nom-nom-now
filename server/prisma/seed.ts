import { PrismaClient, Role, RestaurantStatus, RestaurantCategory } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createRestaurantWithRelations(
  tx: PrismaClient, // Add transaction client parameter

  userData: any,
  restaurantData: any,
  menuItems: any[],
  deliveryZone: any
) {
  try {
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
  } catch (error) {
    console.error('Error in createRestaurantWithRelations:', error);
    throw error;
  }
}

function main() {
  return prisma.$transaction(async (tx) => {
    try {
      console.log('Cleaning existing data...');
      await tx.deliveryZone.deleteMany();
      await tx.menuItem.deleteMany();
      await tx.order.deleteMany();
      await tx.restaurant.deleteMany();
      await tx.address.deleteMany();
      await tx.phoneNumber.deleteMany();
      await tx.user.deleteMany();
      
      console.log('Starting to seed data...');

      // 1. Thakali Kitchen
      await createRestaurantWithRelations(
        {
          email: 'ram@thakalikitchen.com',
          password: 'password123',
          name: 'Ram Thakali',
          role: Role.RESTAURANT_OWNER,
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
          description: 'Experience authentic Thakali cuisine in an elegant setting.',
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
          status: RestaurantStatus.APPROVED,
          isOpen: true,
          rating: 4.7,
          totalRatings: 128,
          documents: {
            businessLicense: 'licenses/tk123.pdf',
            foodSafetyCertificate: 'certificates/safety_tk123.pdf'
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
            imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e84c10c8d43d42d9253d973/1585894686061-HVTBCI04HO2IZPTR1JF6/nepalese-thali.jpg',
            customization: {
              spiceLevels: ['Mild', 'Medium', 'Hot']
            }
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

      // 2. KU Cafe
      await createRestaurantWithRelations(
        {
          email: 'manager@kucafe.com',
          password: 'password123',
          name: 'Sabin Tamang',
          role: Role.RESTAURANT_OWNER,
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
          description: 'Student-friendly cafe with affordable meals and coffee.',
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
          status: RestaurantStatus.APPROVED,
          isOpen: true,
          rating: 4.5,
          totalRatings: 256,
          documents: {
            businessLicense: 'licenses/kc789.pdf',
            foodSafetyCertificate: 'certificates/safety_kc789.pdf'
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
            imageUrl: 'https://www.kitchensanctuary.com/wp-content/uploads/2020/03/Grilled-Chicken-Sandwich-square-FS-.jpg',
            calories: 450,
            allergens: ['Gluten', 'Egg'],
            featured: true
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

      // 3. Banepa Momo House
      await createRestaurantWithRelations(
        {
          email: 'owner@banepamomo.com',
          password: 'password123',
          name: 'Sunita Shrestha',
          role: Role.RESTAURANT_OWNER,
          emailVerified: true
        },
        {
          businessName: 'Banepa Momo House',
          businessRegistrationNumber: 'BM456789',
          ownerName: 'Sunita Shrestha',
          email: 'contact@banepamomo.com',
          phone: '9841234567',
          address: {
            street: 'Banepa Bazaar',
            ward: 7,
            city: 'Banepa',
            province: 'Bagmati',
            latitude: 27.6290,
            longitude: 85.5211
          },
          description: 'Famous for authentic Newari-style momos.',
          cuisineTypes: ['Street Food', 'Nepali', 'Fast Food'],
          categories: [RestaurantCategory.STREET_FOOD],
          businessHours: {
            monday: { open: '11:00', close: '20:00' },
            sunday: { open: '11:00', close: '20:00' }
          },
          minimumOrder: 150,
          averagePreparationTime: 15,
          status: RestaurantStatus.APPROVED,
          isOpen: true,
          rating: 4.6,
          totalRatings: 412,
          documents: {
            businessLicense: 'licenses/bm456.pdf',
            foodSafetyCertificate: 'certificates/safety_bm456.pdf'
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
            description: 'Steamed momos in spicy soup',
            price: 160,
            category: 'Momos',
            preparationTime: 15,
            isAvailable: true,
            imageUrl: 'https://www.foodandwine.com/thmb/AWpElBXxbNG903YKUBxpUQkYEj4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Jhol-Momo-FT-RECIPE0123-89517a3184aa4611901bee205e294800.jpg',
            allergens: ['Gluten'],
            featured: true,
            customization: {
              spiceLevels: ['Mild', 'Medium', 'Extra Spicy']
            }
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

      console.log('Seed data created successfully');
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });