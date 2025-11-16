"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  categoryId: string;
  description: string;
  isOnSale?: boolean;
};

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
  "on-sale": "On Sale",
};

// Component that handles search params (needs to be wrapped in Suspense)
function DiscoverContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Fetch categories for mapping
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data as Array<{ id: string; name: string }>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: mounted,
  });

  // Create category name to ID mapping
  const categoryNameToIdMap = React.useMemo(() => {
    if (!categoriesData) return {};
    const map: { [key: string]: string } = {};
    categoriesData.forEach((cat) => {
      // Map display names to IDs
      const displayName = Object.values(categoryMap).find(
        (display) => display.toLowerCase() === cat.name.toLowerCase()
      );
      if (displayName) {
        map[displayName] = cat.id;
      }
      // Also map slugs to IDs for URL params
      const slug = cat.name.toLowerCase().replace(/\s+/g, "-");
      map[slug] = cat.id;
    });
    return map;
  }, [categoriesData]);

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", activeCategory, currentPage],
    queryFn: async () => {
      let url = `/api/products?page=${currentPage}&limit=${itemsPerPage}`;

      // Add category filter if not "All"
      if (activeCategory !== "All") {
        if (activeCategory === "On Sale") {
          // For "On Sale", we'll filter client-side since API doesn't have direct support
          url += `&inStock=true`;
        } else {
          // Use category ID for filtering
          const categoryId = categoryNameToIdMap[activeCategory];
          if (categoryId) {
            url += `&categoryId=${categoryId}`;
          }
        }
      }

      const response = await axios.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: mounted, // Only fetch after component mounts
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle products data and pagination
  useEffect(() => {
    if (!productsData) return;

    let products = productsData.products || [];

    // Handle "On Sale" filtering client-side since API doesn't have direct support
    if (activeCategory === "On Sale") {
      products = products.filter((product: Product) => product.isOnSale);
    }

    setFilteredProducts(products);
    setTotalPages(productsData.pagination?.totalPages || 1);
    setTotalCount(productsData.pagination?.totalCount || 0);
  }, [productsData, activeCategory]);

  // Get category from URL params on mount and when params change
  useEffect(() => {
    if (!mounted) return;

    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryMap[categoryParam]) {
      const displayCategory = categoryMap[categoryParam];
      setActiveCategory(displayCategory);
      setCurrentPage(1); // Reset to first page when category changes
    } else {
      setActiveCategory("All");
      setCurrentPage(1); // Reset to first page
    }
  }, [searchParams, mounted]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto" suppressHydrationWarning>
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
                  "On Sale",
                ].map((category) => (
                  <button
                    key={category}
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
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-6"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto" suppressHydrationWarning>
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
                "On Sale",
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
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-6"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <span className="text-gray-600 font-poppins">
                  Page {currentPage} of {totalPages} ({totalCount} products)
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-poppins disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
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
