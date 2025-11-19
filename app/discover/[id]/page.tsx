import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "../../components/ProductImageGallery";
import ProductDetails from "../../components/ProductDetails";
import ProductCard from "../../components/ProductCard";
import { ChevronRight, Star } from "lucide-react";
import axios from "axios";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
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
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    const product = response.data.product;

    if (!product) {
      notFound();
    }

    // Get related products (same category, limit 3)
    const relatedResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products?limit=4`
    );
    const allProducts = relatedResponse.data.products;
    const relatedProducts = allProducts
      .filter(
        (p: any) => p.id !== product.id && p.category === product.category
      )
      .slice(0, 3);

    // Get reviews for this product
    const reviewsResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/reviews?productId=${id}`
    );
    const reviews = reviewsResponse.data.reviews || [];

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
          reviews.length
        : 0;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images,
      description: product.description,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
      },
      aggregateRating:
        reviews.length > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: averageRating,
              reviewCount: reviews.length,
            }
          : undefined,
    };

    return (
      <div className="max-w-7xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
                    images={product.images.map(
                      (url: string, index: number) => ({
                        id: `image-${index}`,
                        src: url,
                        alt: `${product.name} - Image ${index + 1}`,
                      })
                    )}
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

          {/* Reviews */}
          <section className="py-16">
            <div className="container max-w-5xl mx-auto px-6 md:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-playfair text-gray-900 mb-4">
                  Customer Reviews
                </h2>
                <p className="text-gray-600 font-poppins">
                  See what others are saying about this product
                </p>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review: any) => {
                    const name = review.user
                      ? `${review.user.firstname} ${review.user.lastname}`.trim()
                      : null;
                    let displayName = "Anonymous";
                    if (name) {
                      const parts = name.trim().split(" ");
                      if (parts.length >= 1) {
                        const firstName = parts[0];
                        const lastInitial =
                          parts.length > 1 ? parts[parts.length - 1][0] : "";
                        displayName = lastInitial
                          ? `${firstName} ${lastInitial}***`
                          : firstName;
                      }
                    }
                    return (
                      <div
                        key={review.id}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 font-poppins">
                          {review.comment}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          - {displayName}
                        </p>
                      </div>
                    );
                  })}
                  {reviews.length > 3 && (
                    <div className="text-center mt-8">
                      <Link
                        href={`/discover/${id}/reviews`}
                        className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium font-poppins"
                      >
                        Read All Reviews ({reviews.length})
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
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
