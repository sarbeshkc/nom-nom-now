// prisma/seed/generators/dataGenerator.ts

import { faker } from '@faker-js/faker';
import { RestaurantCategory } from '@prisma/client';

// Enhanced cuisine types with image search keywords
const cuisineTypes = {
  nepali: {
    types: ['Thakali', 'Newari', 'Himalayan', 'Traditional'],
    dishes: {
      'Thakali': ['dal-bhat', 'thakali-khana', 'nepali-thali'],
      'Newari': ['chatamari', 'bara', 'yomari', 'samay-baji'],
      'Himalayan': ['sherpa-stew', 'thenthuk', 'tibetan-momo'],
      'Traditional': ['gundruk', 'dhido', 'sel-roti']
    }
  },
  asian: {
    types: ['Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese'],
    dishes: {
      'Chinese': ['dimsum', 'kung-pao', 'noodles', 'spring-rolls'],
      'Japanese': ['sushi', 'ramen', 'tempura', 'udon'],
      'Korean': ['kimchi', 'bibimbap', 'bulgogi', 'korean-bbq'],
      'Thai': ['pad-thai', 'green-curry', 'tom-yum'],
      'Vietnamese': ['pho', 'banh-mi', 'spring-rolls']
    }
  },
  western: {
    types: ['Italian', 'French', 'American', 'Mexican'],
    dishes: {
      'Italian': ['pizza', 'pasta', 'risotto', 'lasagna'],
      'French': ['croissant', 'ratatouille', 'coq-au-vin'],
      'American': ['burger', 'steak', 'mac-and-cheese'],
      'Mexican': ['tacos', 'burrito', 'enchiladas', 'quesadilla']
    }
  }
};

const spiceLevels = ['Mild', 'Medium', 'Spicy', 'Extra Spicy'];
const commonAllergens = ['Gluten', 'Dairy', 'Nuts', 'Soy', 'Shellfish', 'Eggs'];
const mealTags = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb'];
const imageQualities = ['professional-food-photography', 'restaurant-food', 'gourmet'];

// Helper functions
const generatePhoneNumber = () => {
  return `98${faker.string.numeric(8)}`;
};

const generateBusinessHours = () => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = {};
  
  days.forEach(day => {
    const isWeekend = day === 'saturday' || day === 'sunday';
    hours[day] = {
      open: isWeekend ? '10:00' : '09:00',
      close: isWeekend ? '21:00' : '22:00'
    };
  });
  
  return hours;
};

const generateFoodImageUrl = (dish: string, cuisine: string): string[] => {
  const baseUrls = [
    `https://source.unsplash.com/featured/?${encodeURIComponent(`${dish},${cuisine},food`)}`,
    `https://source.unsplash.com/1600x900/?${encodeURIComponent(`${dish},${imageQualities[0]}`)}`,
    `https://source.unsplash.com/1200x800/?${encodeURIComponent(`${cuisine},${imageQualities[1]}`)}`
  ];
  
  return baseUrls.map(url => `${url}&random=${faker.number.int(999)}`);
};

const generateMenuItem = (cuisine: string, category: string) => {
  const cuisineInfo = cuisineTypes[cuisine];
  const cuisineType = faker.helpers.arrayElement(cuisineInfo.types);
  const dishType = faker.helpers.arrayElement(cuisineInfo.dishes[cuisineType]);
  
  const price = faker.number.int({ min: 100, max: 1000 });
  const isSpecial = faker.datatype.boolean(0.2);
  
  const nutritionalInfo = {
    calories: faker.number.int({ min: 200, max: 1000 }),
    protein: faker.number.int({ min: 10, max: 50 }),
    carbs: faker.number.int({ min: 20, max: 100 }),
    fat: faker.number.int({ min: 5, max: 40 }),
    fiber: faker.number.int({ min: 2, max: 15 }),
    sodium: faker.number.int({ min: 100, max: 1000 }),
    servingSize: `${faker.number.int({ min: 100, max: 500 })}g`
  };

  const preparationDetails = {
    time: faker.number.int({ min: 10, max: 40 }),
    difficulty: faker.helpers.arrayElement(['Easy', 'Medium', 'Complex']),
    instructions: Array.from({ length: 3 }, () => faker.lorem.sentence()),
    chefNotes: faker.lorem.sentence()
  };

  return {
    name: `${cuisineType} ${dishType}`,
    description: faker.lorem.paragraph(),
    price,
    category,
    preparationTime: preparationDetails.time,
    isAvailable: faker.datatype.boolean(0.9),
    images: generateFoodImageUrl(dishType, cuisineType),
    thumbnailUrl: generateFoodImageUrl(dishType, cuisineType)[0],
    allergens: faker.helpers.arrayElements(commonAllergens, { min: 0, max: 3 }),
    nutritionalInfo,
    specialTags: [
      ...faker.helpers.arrayElements(mealTags, { min: 0, max: 2 }),
      ...(isSpecial ? ['Chef\'s Special'] : [])
    ],
    customization: {
      spiceLevels: faker.helpers.arrayElements(spiceLevels, { min: 2, max: 4 }),
      extras: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
        name: `Extra ${faker.commerce.productAdjective()}`,
        price: faker.number.int({ min: 30, max: 150 })
      })),
      size: ['Small', 'Regular', 'Large'].map(size => ({
        name: size,
        price: price * (size === 'Small' ? 0.8 : size === 'Large' ? 1.2 : 1)
      }))
    },
    preparationDetails,
    ratings: {
      average: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
      count: faker.number.int({ min: 10, max: 200 }),
      reviews: Array.from({ length: 3 }, () => ({
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
        date: faker.date.recent()
      }))
    },
    seasonal: faker.datatype.boolean(0.2),
    popularityScore: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
    isSpecial,
    discountPrice: isSpecial ? price * 0.8 : null,
    discountValidUntil: isSpecial ? faker.date.future() : null
  };
};

const generateDeliveryZone = (city: string, coordinates: [number, number]) => {
  const [baseLat, baseLong] = coordinates;
  
  return {
    name: `${city} Delivery Zone`,
    radius: faker.number.int({ min: 2, max: 6 }),
    baseDeliveryFee: faker.number.int({ min: 50, max: 150 }),
    minimumOrder: faker.number.int({ min: 200, max: 800 }),
    boundaries: {
      type: 'Polygon',
      coordinates: [[
        [baseLong + faker.number.float({ min: -0.01, max: 0.01 }), baseLat + faker.number.float({ min: -0.01, max: 0.01 })],
        [baseLong + faker.number.float({ min: -0.01, max: 0.01 }), baseLat + faker.number.float({ min: -0.01, max: 0.01 })],
        [baseLong + faker.number.float({ min: -0.01, max: 0.01 }), baseLat + faker.number.float({ min: -0.01, max: 0.01 })],
        [baseLong + faker.number.float({ min: -0.01, max: 0.01 }), baseLat + faker.number.float({ min: -0.01, max: 0.01 })]
      ]]
    },
    estimatedTime: faker.number.int({ min: 15, max: 45 }),
    isActive: true
  };
};

export const generateRestaurantData = (
  cuisine: string,
  city: string = 'Kathmandu',
  coordinates: [number, number] = [27.7172, 85.3240]
) => {
  const businessName = faker.company.name();
  const ownerName = faker.person.fullName();
  
  return {
    userData: {
      email: faker.internet.email({ firstName: ownerName.split(' ')[0], lastName: ownerName.split(' ')[1] }).toLowerCase(),
      password: 'password123', // In production, this should be hashed
      name: ownerName,
      role: 'RESTAURANT_OWNER',
      emailVerified: true
    },
    restaurantData: {
      businessName,
      businessRegistrationNumber: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
      ownerName,
      email: `contact@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: generatePhoneNumber(),
      alternatePhone: generatePhoneNumber(),
      address: {
        street: faker.location.street(),
        ward: faker.number.int({ min: 1, max: 32 }),
        city,
        province: 'Bagmati',
        latitude: coordinates[0] + faker.number.float({ min: -0.02, max: 0.02 }),
        longitude: coordinates[1] + faker.number.float({ min: -0.02, max: 0.02 })
      },
      description: faker.lorem.paragraph(),
      cuisineTypes: faker.helpers.arrayElements(cuisineTypes[cuisine].types, { min: 1, max: 3 }),
      categories: [faker.helpers.arrayElement(Object.values(RestaurantCategory))],
      businessHours: generateBusinessHours(),
      minimumOrder: faker.number.int({ min: 200, max: 1000 }),
      averagePreparationTime: faker.number.int({ min: 15, max: 45 }),
      status: 'APPROVED',
      isOpen: true,
      rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
      totalRatings: faker.number.int({ min: 50, max: 500 }),
      documents: {
        businessLicense: `license_${faker.string.alphanumeric(6)}.pdf`,
        foodSafetyCertificate: `safety_cert_${faker.string.alphanumeric(6)}.pdf`
      },
      bankDetails: {
        accountName: `${businessName} Pvt. Ltd`,
        accountNumber: faker.finance.accountNumber(),
        bankName: faker.helpers.arrayElement([
          'Nepal Investment Bank',
          'NMB Bank',
          'Nabil Bank',
          'Sanima Bank'
        ]),
        branch: city
      }
    },
    menuItems: Array.from({ length: 20 }, () => 
      generateMenuItem(cuisine, faker.helpers.arrayElement(['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Specials']))
    ),
    deliveryZone: generateDeliveryZone(city, coordinates)
  };
};

export const generateMultipleRestaurants = (count: number = 10) => {
  const cities = [
    { name: 'Kathmandu', coords: [27.7172, 85.3240] },
    { name: 'Lalitpur', coords: [27.6588, 85.3247] },
    { name: 'Bhaktapur', coords: [27.6710, 85.4298] },
    { name: 'Banepa', coords: [27.6290, 85.5211] },
    { name: 'Dhulikhel', coords: [27.6195, 85.5386] }
  ];
  
  return Array.from({ length: count }, () => {
    const city = faker.helpers.arrayElement(cities);
    const cuisine = faker.helpers.arrayElement(Object.keys(cuisineTypes));
    return generateRestaurantData(cuisine, city.name, city.coords);
  });
};