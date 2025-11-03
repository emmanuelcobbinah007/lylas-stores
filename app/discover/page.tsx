import React from "react";
import ProductCard from "@/app/components/ProductCard";
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
    price: "$220",
    image: "/ambientLamp.jpg",
    category: "Lighting",
    description: "Warm illumination for intimate spaces",
  },
  {
    id: "002",
    name: "Handcrafted Mirror",
    price: "$410",
    image: "/beautifulMirror.jpg",
    category: "Decor",
    description: "Elegant reflection of timeless craftsmanship",
  },
  {
    id: "003",
    name: "Sculpted Bedframe",
    price: "$1,250",
    image: "/bedframe.jpg",
    category: "Bedroom",
    description: "Sophisticated comfort for restful nights",
  },
  {
    id: "004",
    name: "Kitchen Stools (Set of 2)",
    price: "$340",
    image: "/kitchenstool.jpg",
    category: "Kitchen",
    description: "Modern seating with artisanal appeal",
  },
  {
    id: "005",
    name: "Dining Collection",
    price: "$2,100",
    image: "/dininginspi.jpeg",
    category: "Dining",
    description: "Complete set for memorable gatherings",
  },
  {
    id: "006",
    name: "Living Room Accent",
    price: "$680",
    image: "/livingroominspi.jpg",
    category: "Living",
    description: "Statement piece for curated living",
  },
];

export const metadata = {
  title: "Discover — Lyla’s",
  description: "Discover curated pieces and bestsellers from Lyla’s collection",
};

export default function DiscoverPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="my-14"></div>
      <main className="min-h-screen">
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                All
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                New
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Living Room
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Bedroom
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Kitchen
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Bathroom
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Outdoor
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Decor
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Lighting
              </Link>
              <Link
                href="#"
                className="px-3 py-2 text-sm rounded bg-white border border-gray-200 text-gray-700 font-poppins"
              >
                Storage
              </Link>
            </div>
          </div>
        </section>

        <section className="pt-3 pb-12">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
