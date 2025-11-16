import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import axios from "axios";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
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
      title: `Reviews for ${product.name} - Lyla's`,
      description: `Read customer reviews for ${product.name}`,
    };
  } catch (error) {
    return {
      title: "Product Not Found - Lyla's",
    };
  }
}

export default async function ProductReviewsPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const reviewsPerPage = 10;

  try {
    // Fetch product
    const productResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products/${id}`
    );
    const product = productResponse.data.product;

    if (!product) {
      notFound();
    }

    // Fetch all reviews
    const reviewsResponse = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/reviews?productId=${id}`
    );
    const allReviews = reviewsResponse.data.reviews || [];

    // Pagination
    const totalReviews = allReviews.length;
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const reviews = allReviews.slice(startIndex, endIndex);

    return (
      <div className="max-w-4xl mx-auto">
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
                <Link
                  href={`/discover/${id}`}
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  {product.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Reviews</span>
              </nav>
            </div>
          </section>

          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto px-6 md:px-8">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-playfair text-gray-900 mb-4">
                  Customer Reviews for {product.name}
                </h1>
                <p className="text-gray-600 font-poppins">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""} • Page{" "}
                  {currentPage} of {totalPages}
                </p>
              </div>

              {/* Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => {
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
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 font-poppins mb-4">
                          {review.comment}
                        </p>
                        <p className="text-sm text-gray-500">- {displayName}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No reviews yet. Be the first to review this product!
                </p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  {currentPage > 1 && (
                    <Link
                      href={`/discover/${id}/reviews?page=${currentPage - 1}`}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-poppins"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Link>
                  )}

                  <span className="text-gray-600 font-poppins">
                    Page {currentPage} of {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={`/discover/${id}/reviews?page=${currentPage + 1}`}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-poppins"
                    >
                      Next
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              )}

              {/* Back to Product */}
              <div className="text-center mt-12">
                <Link
                  href={`/discover/${id}`}
                  className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium font-poppins"
                >
                  Back to Product
                </Link>
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
