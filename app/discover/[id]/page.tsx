import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "../../components/ProductImageGallery";
import ProductDetails from "../../components/ProductDetails";
import ProductCard from "../../components/ProductCard";
import { ChevronRight } from "lucide-react";
import axios from "axios";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    const product = response.data.product;

    if (!product) {
      return {
        title: "Product Not Found - Lyla's",
      };
    }

    return {
      title: `${product.name} - Lyla's`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found - Lyla's",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    const product = response.data.product;

    if (!product) {
      notFound();
    }

    // Get related products (same category, limit 3)
    const relatedResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/products?limit=4`
    );
    const allProducts = relatedResponse.data.products;
    const relatedProducts = allProducts
      .filter(
        (p: any) => p.id !== product.id && p.category === product.category
      )
      .slice(0, 3);

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
                {relatedProducts.map((relatedProduct: any, index: number) => (
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
  } catch (error) {
    notFound();
  }
}
