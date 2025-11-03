import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/app/components/ProductImageGallery";
import ProductDetails from "@/app/components/ProductDetails";
import ProductCard from "@/app/components/ProductCard";
import { ChevronRight } from "lucide-react";

// Mock product data - in a real app, this would come from an API or database
const mockProducts = {
  "001": {
    id: "001",
    name: "Ambient Table Lamp",
    price: "₵220",
    originalPrice: "₵280",
    rating: 4.8,
    reviewCount: 24,
    description:
      "Illuminate your space with our sophisticated Ambient Table Lamp. Crafted with premium materials and designed for both form and function, this lamp brings a warm, inviting glow to any room. The adjustable brightness settings allow you to create the perfect ambiance for any occasion.",
    features: [
      "Adjustable brightness with touch controls",
      "Premium brass base with matte finish",
      "Linen fabric shade for soft light diffusion",
      "Energy-efficient LED bulb included",
      "Cord length: 6 feet with inline dimmer",
    ],
    specifications: {
      Dimensions: '12" W × 18" H',
      Weight: "3.2 lbs",
      Material: "Brass, Linen",
      "Bulb Type": "LED (included)",
      Wattage: "15W",
      "Color Temperature": "2700K Warm White",
    },
    inStock: true,
    category: "Lighting",
    images: [
      {
        id: "1",
        src: "/ambientLamp.jpg",
        alt: "Ambient Table Lamp - Main View",
      },
      {
        id: "2",
        src: "/beautifulMirror.jpg",
        alt: "Ambient Table Lamp - Detail View",
      },
      { id: "3", src: "/bedframe.jpg", alt: "Ambient Table Lamp - In Use" },
    ],
  },
  "002": {
    id: "002",
    name: "Handcrafted Mirror",
    price: "₵410",
    rating: 4.9,
    reviewCount: 18,
    description:
      "A stunning handcrafted mirror that serves as both a functional piece and artistic statement. Each mirror is individually crafted by skilled artisans, featuring unique characteristics that make every piece one-of-a-kind.",
    features: [
      "Hand-forged metal frame",
      "Distressed finish for vintage appeal",
      "High-quality silvered glass",
      "Ready to hang hardware included",
      "Moisture-resistant coating",
    ],
    specifications: {
      Dimensions: '24" W × 36" H',
      Weight: "8.5 lbs",
      Material: "Metal, Glass",
      "Frame Width": "2 inches",
      "Glass Thickness": "5mm",
      Mounting: "Wall Mount",
    },
    inStock: true,
    category: "Decor",
    images: [
      {
        id: "1",
        src: "/beautifulMirror.jpg",
        alt: "Handcrafted Mirror - Main View",
      },
      {
        id: "2",
        src: "/ambientLamp.jpg",
        alt: "Handcrafted Mirror - Detail View",
      },
    ],
  },
  "003": {
    id: "003",
    name: "Sculpted Bedframe",
    price: "₵1,250",
    originalPrice: "₵1,450",
    rating: 4.7,
    reviewCount: 31,
    description:
      "Transform your bedroom with our luxurious Sculpted Bedframe. This masterpiece combines modern design with timeless elegance, featuring a unique sculpted headboard that serves as the perfect focal point for your sanctuary.",
    features: [
      "Solid oak construction",
      "Hand-sculpted headboard design",
      "Natural wood grain finish",
      "Platform base eliminates need for box spring",
      "Easy assembly with included hardware",
    ],
    specifications: {
      Size: 'Queen (60" × 80")',
      "Headboard Height": "48 inches",
      Weight: "95 lbs",
      Material: "Solid Oak",
      Finish: "Natural Oil",
      "Box Spring": "Not Required",
    },
    inStock: false,
    category: "Bedroom",
    images: [
      { id: "1", src: "/bedframe.jpg", alt: "Sculpted Bedframe - Main View" },
      {
        id: "2",
        src: "/bedroominspi.jpg",
        alt: "Sculpted Bedframe - In Bedroom",
      },
    ],
  },
};

// Related products for recommendations
const relatedProducts = [
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
    category: "Living",
    description: "Statement piece for curated living",
  },
];

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = mockProducts[id as keyof typeof mockProducts];

  if (!product) {
    return {
      title: "Product Not Found - Lyla's",
    };
  }

  return {
    title: `${product.name} - Lyla's`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = mockProducts[id as keyof typeof mockProducts];

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="my-28"></div>
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-6">
          <div className="container mx-auto px-6 md:px-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 font-poppins">
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href="/discover"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Discover
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Content */}
        <section className="pb-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Product Images */}
              <div>
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                />
              </div>

              {/* Product Details */}
              <div>
                <ProductDetails product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-playfair text-gray-900 mb-4">
                You Might Also Like
              </h2>
              <p className="text-gray-600 font-poppins">
                Discover more pieces to complete your space
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
