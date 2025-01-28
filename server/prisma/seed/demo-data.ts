// Demo restaurant data following Prisma schema
// This can be used for seeding the database or initial frontend development

const demoRestaurants = [
    {
      id: "rest1",
      userId: "user1", // Will need to match a user with RESTAURANT_OWNER role
      businessName: "Thakali Kitchen",
      businessRegistrationNumber: "TK123456",
      ownerName: "Ram Thakali",
      email: "contact@thakalikitchen.com",
      phone: "9841234567",
      alternatePhone: "9867894532",
      address: {
        street: "Thamel Marg",
        ward: 29,
        city: "Kathmandu",
        province: "Bagmati",
        location: {
          type: "Point",
          coordinates: [27.7172, 85.3240] // [lat, lng] for Thamel
        }
      },
      description: "Authentic Thakali cuisine in the heart of Thamel. Famous for our dal-bhat and buckwheat dishes.",
      cuisineTypes: ["Thakali", "Nepali", "Traditional"],
      businessHours: {
        monday: { open: "10:00", close: "21:00" },
        tuesday: { open: "10:00", close: "21:00" },
        wednesday: { open: "10:00", close: "21:00" },
        thursday: { open: "10:00", close: "21:00" },
        friday: { open: "10:00", close: "22:00" },
        saturday: { open: "10:00", close: "22:00" },
        sunday: { open: "10:00", close: "21:00" }
      },
      deliveryAreas: [
        {
          radius: 5,
          city: "Kathmandu",
          province: "Bagmati",
          baseFee: 100,
          minimumOrder: 500
        }
      ],
      menu: [
        {
          id: "item1",
          name: "Thakali Set",
          description: "Traditional Thakali dal-bhat set with chicken curry",
          price: 450,
          category: "Main Course",
          isAvailable: true,
          imageUrl: "/images/thakali-set.jpg"
        },
        {
          id: "item2",
          name: "Buckwheat Dhido",
          description: "Traditional buckwheat dhido with spinach curry",
          price: 350,
          category: "Main Course",
          isAvailable: true,
          imageUrl: "/images/dhido.jpg"
        }
      ],
      minimumOrder: 500,
      averagePreparationTime: 30,
      status: "APPROVED",
      isOpen: true,
      rating: 4.7,
      totalRatings: 128,
      documents: {
        businessLicense: "license_tk123.pdf",
        foodSafetyCertificate: "safety_cert_tk123.pdf",
        panCard: "pan_tk123.pdf"
      },
      bankDetails: {
        accountName: "Thakali Kitchen Pvt. Ltd",
        accountNumber: "0123456789",
        bankName: "Nepal Investment Bank",
        branch: "Thamel"
      }
    },
    {
      id: "rest2",
      userId: "user2",
      businessName: "Momo House Dhulikhel",
      businessRegistrationNumber: "MH789012",
      ownerName: "Sita Shrestha",
      email: "contact@momohouse.com",
      phone: "9849876543",
      alternatePhone: "9812345678",
      address: {
        street: "Dhulikhel Bazaar Road",
        ward: 5,
        city: "Dhulikhel",
        province: "Bagmati",
        location: {
          type: "Point",
          coordinates: [27.6192, 85.5484] // [lat, lng] for Dhulikhel
        }
      },
      description: "Best momos in Dhulikhel! Famous for our jhol momo and unique fillings.",
      cuisineTypes: ["Nepali", "Fast Food", "Street Food"],
      businessHours: {
        monday: { open: "11:00", close: "20:00" },
        tuesday: { open: "11:00", close: "20:00" },
        wednesday: { open: "11:00", close: "20:00" },
        thursday: { open: "11:00", close: "20:00" },
        friday: { open: "11:00", close: "21:00" },
        saturday: { open: "11:00", close: "21:00" },
        sunday: { open: "11:00", close: "20:00" }
      },
      deliveryAreas: [
        {
          radius: 3,
          city: "Dhulikhel",
          province: "Bagmati",
          baseFee: 50,
          minimumOrder: 300
        }
      ],
      menu: [
        {
          id: "item3",
          name: "Chicken Jhol Momo",
          description: "Juicy chicken momos served in spicy soup",
          price: 180,
          category: "Momos",
          isAvailable: true,
          imageUrl: "/images/jhol-momo.jpg"
        },
        {
          id: "item4",
          name: "Buff C Momo",
          description: "Fried buff momos with special chili sauce",
          price: 160,
          category: "Momos",
          isAvailable: true,
          imageUrl: "/images/c-momo.jpg"
        }
      ],
      minimumOrder: 300,
      averagePreparationTime: 20,
      status: "APPROVED",
      isOpen: true,
      rating: 4.5,
      totalRatings: 256,
      documents: {
        businessLicense: "license_mh789.pdf",
        foodSafetyCertificate: "safety_cert_mh789.pdf",
        panCard: "pan_mh789.pdf"
      },
      bankDetails: {
        accountName: "Momo House Pvt. Ltd",
        accountNumber: "9876543210",
        bankName: "NMB Bank",
        branch: "Dhulikhel"
      }
    },
    {
      id: "rest3",
      userId: "user3",
      businessName: "Banepa Sekuwa Corner",
      businessRegistrationNumber: "BS345678",
      ownerName: "Krishna Tamang",
      email: "contact@sekuwacorner.com",
      phone: "9845678901",
      alternatePhone: "9823456789",
      address: {
        street: "Banepa Tindobato",
        ward: 8,
        city: "Banepa",
        province: "Bagmati",
        location: {
          type: "Point",
          coordinates: [27.6295, 85.5214] // [lat, lng] for Banepa
        }
      },
      description: "Famous for traditional Nepali sekuwa and grilled items. Perfect for family gatherings.",
      cuisineTypes: ["Nepali", "BBQ", "Traditional"],
      businessHours: {
        monday: { open: "12:00", close: "22:00" },
        tuesday: { open: "12:00", close: "22:00" },
        wednesday: { open: "12:00", close: "22:00" },
        thursday: { open: "12:00", close: "22:00" },
        friday: { open: "12:00", close: "23:00" },
        saturday: { open: "12:00", close: "23:00" },
        sunday: { open: "12:00", close: "22:00" }
      },
      deliveryAreas: [
        {
          radius: 4,
          city: "Banepa",
          province: "Bagmati",
          baseFee: 80,
          minimumOrder: 400
        }
      ],
      menu: [
        {
          id: "item5",
          name: "Mixed Sekuwa Platter",
          description: "Assorted grilled meats with peanuts and churpi",
          price: 650,
          category: "BBQ",
          isAvailable: true,
          imageUrl: "/images/sekuwa-platter.jpg"
        },
        {
          id: "item6",
          name: "Chicken Chhoyla",
          description: "Spicy grilled chicken in Newari style",
          price: 320,
          category: "BBQ",
          isAvailable: true,
          imageUrl: "/images/chhoyla.jpg"
        }
      ],
      minimumOrder: 400,
      averagePreparationTime: 35,
      status: "APPROVED",
      isOpen: true,
      rating: 4.6,
      totalRatings: 189,
      documents: {
        businessLicense: "license_bs345.pdf",
        foodSafetyCertificate: "safety_cert_bs345.pdf",
        panCard: "pan_bs345.pdf"
      },
      bankDetails: {
        accountName: "Banepa Sekuwa Corner",
        accountNumber: "5432109876",
        bankName: "Sanima Bank",
        branch: "Banepa"
      }
    }
  ];
  
  // Function to create associated user accounts for restaurant owners
  const demoUsers = [
    {
      id: "user1",
      email: "ram@thakalikitchen.com",
      password: "hashed_password_here", // Would be properly hashed in real implementation
      name: "Ram Thakali",
      role: "RESTAURANT_OWNER",
      emailVerified: true
    },
    {
      id: "user2",
      email: "sita@momohouse.com",
      password: "hashed_password_here",
      name: "Sita Shrestha",
      role: "RESTAURANT_OWNER",
      emailVerified: true
    },
    {
      id: "user3",
      email: "krishna@sekuwacorner.com",
      password: "hashed_password_here",
      name: "Krishna Tamang",
      role: "RESTAURANT_OWNER",
      emailVerified: true
    }
  ];
  
  // Sample orders to demonstrate order functionality
  const demoOrders = [
    {
      id: "order1",
      userId: "customer1",
      restaurantId: "rest1",
      orderNumber: "TK12345",
      items: [
        {
          id: "item1",
          name: "Thakali Set",
          quantity: 2,
          price: 450,
          totalPrice: 900
        }
      ],
      total: 900,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "CASH",
      deliveryAddress: {
        street: "Baluwatar",
        ward: 4,
        city: "Kathmandu",
        contactNumber: "9876543210"
      },
      specialInstructions: "Extra spicy please"
    }
  ];
  
  export { demoRestaurants, demoUsers, demoOrders };r
  