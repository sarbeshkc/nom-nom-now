import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
// import Image from 'next/image';

const HomePage = () => {
  // Data moved inside the component for simplicity
  const popularDishes = [
    {
      name: "Spaghetti with meatballs",
      description: "Classic Italian pasta topped with savory meatballs.",
      price: 320,
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Steak with roasted veggies",
      description: "Tender steak paired with perfectly seasoned roasted vegetables.",
      price: 480,
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Veg Thukpa with extra spice",
      description: "Spicy noodle soup bursting with Himalayan flavors.",
      price: 220,
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Spicy Dumplings",
      description: "Flavorful dumplings with a fiery, irresistible spicy kick",
      price: 180,
      image: "/placeholder.svg?height=200&width=200"
    }
  ];

  const newestRecipes = [
    {
      name: "Spaghetti with meatballs",
      time: "15 minutes",
      portion: "2 Persons",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Steak with roasted veggies",
      time: "30 minutes",
      portion: "4 Persons",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Veg Thukpa with extra spice",
      time: "25 minutes",
      portion: "1 Persons",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Spicy Dumplings",
      time: "30 minutes",
      portion: "2 Persons",
      image: "/placeholder.svg?height=200&width=200"
    }
  ];

  const categories = [
    {
      name: "MoMo Mania",
      description: "Steamed, fried, and jhol momos.",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Fast Food Fix",
      description: "Burgers, pizzas, and fried chicken.",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Newari Cuisine",
      description: "Yomari, bara, sekuwa, sukuti, and chhoyala.",
      image: "/placeholder.svg?height=200&width=200"
    },
    {
      name: "Stick Food Craze",
      description: "Potato sticks, sausage sticks, kima noodles, and tacos.",
      image: "/placeholder.svg?height=200&width=200"
    }
  ];

  // Render the main component
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
                <span className="text-[#FF4500]">fresh and fast.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                At <span className="font-semibold">Nom Nom Now</span>,{' '}
                <span className="text-[#FF4500]">we're here to deliver the flavors you crave, right to your doorstep.</span>{' '}
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
                <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90">
                  How To Order
                </Button>
              </div>
            </div>
            <div className="relative h-[400px]">
              <div className="absolute top-0 right-0 w-48 h-48">
                {/* <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Food 1"
                  width={200}
                  height={200}
                  className="rounded-full"
                /> */}
              </div>
              <div className="absolute bottom-0 left-0 w-56 h-56">
                {/* <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Food 2"
                  width={200}
                  height={200}
                  className="rounded-full"
                /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Dishes Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Popular Dishes</h2>
            <Button variant="ghost" className="text-[#FF4500]">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  {/* <Image
                    src={dish.image}
                    alt={dish.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  /> */}
                </div>
                <h3 className="text-xl font-semibold text-[#FF4500] mb-2">{dish.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Rs. {dish.price}</span>
                  <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90">
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
            <Button variant="ghost" className="text-[#FF4500]">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newestRecipes.map((recipe, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                  {/* <Image
                    src={recipe.image}
                    alt={recipe.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  /> */}
                </div>
                <h3 className="text-xl font-semibold text-[#FF4500] mb-4">{recipe.name}</h3>
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
                <span className="text-[#FF4500]">Dinner Plans</span> today?{' '}
                <span className="text-[#FF4500]">Reserve</span> Your Table?
              </h2>
              <p className="text-gray-600 mb-6">
                Book your table{' '}
                <span className="text-[#FF4500]">instantly, read genuine reviews, and</span>{' '}
                earn rewards for every reservation. With Nom Nom Now,{' '}
                <span className="text-[#FF4500]">dining out becomes effortless and rewarding</span>—
                reserve in real-time and enjoy exclusive perks!
              </p>
              <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90">
                Make Reservation
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden h-[300px]">
              {/* <Image
                src="/placeholder.svg?height=300&width=500"
                alt="Restaurant ambiance"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              /> */}
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
                  {/* <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  /> */}
                </div>
                <h3 className="text-xl font-semibold text-[#FF4500] mb-2">{category.name}</h3>
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