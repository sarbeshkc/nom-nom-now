import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Link } from "react-router-dom";

const HomePage = () => {
  const popularDishes = [
    {
      name: "Spaghetti with meatballs",
      description: "Classic Italian pasta topped with savory meatballs.",
      price: 320,
      image: "/spawmeatballs.png" // Update with actual path
    },
    {
      name: "Steak with roasted veggies",
      description: "Tender steak paired with perfectly seasoned roasted vegetables.",
      price: 480,
      image: "/steak.png" // Update with actual path
    },
    {
      name: "Veg Thukpa with extra spice",
      description: "Spicy noodle soup bursting with Himalayan flavors.",
      price: 220,
      image: "/vegthukpa.png" // Update with actual path
    },
    {
      name: "Spicy Dumplings",
      description: "Flavorful dumplings with a fiery, irresistible spicy kick",
      price: 180,
      image: "/spicymo.png" // Update with actual path
    }
  ];

  const newestRecipes = [
    {
      name: "Spaghetti with meatballs",
      time: "15 minutes",
      portion: "2 Persons",
      image: "/spawmeatballs.png" // Update with actual path
    },
    {
      name: "Steak with roasted veggies",
      time: "30 minutes",
      portion: "4 Persons",
      image: "/steak.png" // Update with actual path
    },
    {
      name: "Veg Thukpa with extra spice",
      time: "25 minutes",
      portion: "1 Persons",
      image: "/vegthukpa.png" // Update with actual path
    },
    {
      name: "Spicy Dumplings",
      time: "30 minutes",
      portion: "2 Persons",
      image: "/spicymo.png" // Update with actual path
    }
  ];

  const categories = [
    {
      name: "MoMo Mania",
      description: "Steamed, fried, and jhol momos.",
      image: "/momomania.png" // Update with actual path
    },
    {
      name: "Fast Food Fix",
      description: "Burgers, pizzas, and fried chicken.",
      image: "/fastfood.png" // Update with actual path
    },
    {
      name: "Newari Cuisine",
      description: "Yomari, bara, sekuwa, sukuti, and chhoyala.",
      image: "/newari.png" // Update with actual path
    },
    {
      name: "Stick Food Craze",
      description: "Potato sticks, sausage sticks, kima noodles, and tacos.",
      image: "/stick.png" // Update with actual path
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-6xl font-bold leading-tight mb-6">
                Bringing your cravings to your door,{' '}
                <span className="text-[#F1954B]">fresh and fast.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                At <span className="font-semibold">Nom Nom Now</span>,{' '}
                <span className="text-[#F1954B]">we're here to deliver the flavors you crave, right to your doorstep.</span>{' '}
                Whether it's a quick snack or a hearty meal, we ensure every order arrives{' '}
                <span className="font-semibold">fresh</span>,{' '}
                <span className="font-semibold">fast</span>, and{' '}
                <span className="font-semibold">full of taste</span>. Enjoy your favorite dishes without stepping out!
              </p>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search for dishes..." className="pl-10 bg-gray-50" />
                </div>
                <Link to="/how-to-order">
                  <Button className="bg-[#FF780B] hover:bg-[#F1954B]/90">
                    How To Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px]">
              <div className="absolute top-0 right-0 w-48 h-48">
                <img src="/images/hero-food-1.png" alt="Food 1" className="rounded-full w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 w-56 h-56">
                <img src="/images/hero-food-2.png" alt="Food 2" className="rounded-full w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Dishes Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Popular Dishes</h2>
            <Button variant="ghost" className="text-[#F1954B]">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-[#F1954B] mb-2">{dish.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Rs. {dish.price}</span>
                  <Button className="bg-[#F1954B] hover:bg-[#F1954B]/90">
                    Add To Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newest Recipes Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Newest Recipes</h2>
            <Button variant="ghost" className="text-[#F1954B]">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newestRecipes.map((recipe, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-[#F1954B] mb-4">{recipe.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Time</p>
                    <p>{recipe.time}</p>
                  </div>
                  <div>
                    <p className="font-medium">Portion</p>
                    <p>{recipe.portion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reservation Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-8">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Do You Have any{' '}
                <span className="text-[#F1954B]">Dinner Plans</span> today?{' '}
                <span className="text-[#F1954B]">Reserve</span> Your Table?
              </h2>
              <p className="text-gray-600 mb-6">
                Book your table{' '}
                <span className="text-[#F1954B]">instantly, read genuine reviews, and</span>{' '}
                earn rewards for every reservation. With Nom Nom Now,{' '}
                <span className="text-[#F1954B]">dining out becomes effortless and rewarding</span>—
                reserve in real-time and enjoy exclusive perks!
              </p>
              <Link to="/reservation">
                <Button className="bg-[#F1954B] hover:bg-[#F1954B]/90">
                  Make Reservation
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden h-[300px]">
              <img src="/reservation.png" alt="Restaurant ambiance" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold mb-8">What You're Craving For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-[#F1954B] mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;