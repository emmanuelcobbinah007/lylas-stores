"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
};

const products: Product[] = [
  {
    id: "001",
    name: "Ambient Table Lamp",
    price: "₵220",
    image: "/ambientLamp.jpg",
    category: "Lighting",
    description: "Warm illumination for intimate spaces",
  },
  {
    id: "002",
    name: "Handcrafted Mirror",
    price: "₵410",
    image: "/beautifulMirror.jpg",
    category: "Decor",
    description: "Elegant reflection of timeless craftsmanship",
  },
  {
    id: "003",
    name: "Sculpted Bedframe",
    price: "₵1,250",
    image: "/bedframe.jpg",
    category: "Bedroom",
    description: "Sophisticated comfort for restful nights",
  },
  {
    id: "004",
    name: "Kitchen Stools (Set of 2)",
    price: "₵340",
    image: "/kitchenstool.jpg",
    category: "Kitchen",
    description: "Modern seating with artisanal appeal",
  },
  {
    id: "005",
    name: "Dining Collection",
    price: "₵2,100",
    image: "/dininginspi.jpeg",
    category: "Dining",
    description: "Complete set for memorable gatherings",
  },
  {
    id: "006",
    name: "Living Room Accent",
    price: "₵680",
    image: "/livingroominspi.jpg",
    category: "Living Room",
    description: "Statement piece for curated living",
  },
  // Additional products for better category representation
  {
    id: "007",
    name: "Bathroom Vanity Mirror",
    price: "₵580",
    image: "/beautifulMirror.jpg",
    category: "Bathroom",
    description: "Premium vanity mirror for luxury bathrooms",
  },
  {
    id: "008",
    name: "Outdoor Dining Set",
    price: "₵1,850",
    image: "/dininginspi.jpeg",
    category: "Outdoor",
    description: "Weather-resistant outdoor dining experience",
  },
  {
    id: "009",
    name: "Storage Ottoman",
    price: "₵420",
    image: "/livingroominspi.jpg",
    category: "Storage",
    description: "Stylish storage solution for any room",
  },
];

// Category mapping for URL params to display names
const categoryMap: { [key: string]: string } = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  outdoor: "Outdoor",
  decor: "Decor",
  lighting: "Lighting",
  storage: "Storage",
  dining: "Dining",
};

// Component that handles search params (needs to be wrapped in Suspense)
function DiscoverContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Get category from URL params on mount and when params change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryMap[categoryParam]) {
      const displayCategory = categoryMap[categoryParam];
      setActiveCategory(displayCategory);
      setFilteredProducts(
        products.filter((product) => product.category === displayCategory)
      );
    } else {
      setActiveCategory("All");
      setFilteredProducts(products);
    }
  }, [searchParams]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="my-14"></div>
      <main className="min-h-screen">
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              {[
                "All",
                "New",
                "Living Room",
                "Bedroom",
                "Kitchen",
                "Bathroom",
                "Outdoor",
                "Decor",
                "Lighting",
                "Storage",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-2 text-sm rounded font-poppins transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-3 pb-12">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
