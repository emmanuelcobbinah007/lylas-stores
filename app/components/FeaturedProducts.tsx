"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { blurDataURL } from "./ui/ImageShimmer";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
  isOnSale?: boolean;
  rating: number;
  reviews: number;
};

const FeaturedProducts = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/featured-products");
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-playfair"
          >
            Bestselling Pieces
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins"
          >
            Our most coveted home decor pieces, loved by customers for their
            exceptional quality and timeless appeal
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-50 rounded-lg animate-pulse">
                  <div className="absolute inset-0 bg-white rounded-lg shadow-lg"></div>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </motion.div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 font-poppins">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 font-poppins">
                No featured products available
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="group cursor-pointer"
              >
                {/* Product Image */}
                <motion.div
                  className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-50 rounded-lg"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500"></div>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority={index < 2} // Priority for first two images
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    className="object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Sale Badge */}
                  {product.isOnSale && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold font-poppins z-10">
                      SALE
                    </div>
                  )}

                  {/* Price overlay - shows on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"
                  >
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full">
                      <span className="text-lg font-medium text-gray-900 font-poppins">
                        {product.price}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-poppins">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-light text-gray-900 group-hover:text-gray-600 transition-colors duration-300 font-playfair">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-poppins">
                    {product.description}
                  </p>
                  {/* Price Display */}
                  <div className="flex items-center justify-center gap-2">
                    {product.isOnSale && product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through font-poppins">
                        {product.originalPrice}
                      </span>
                    )}
                    <span
                      className={`text-lg font-medium font-poppins ${
                        product.isOnSale ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {product.price}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>

        {/* View All Link */}
        <Link href="/discover">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center px-8 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:cursor-pointer hover:border-gray-900 transition-all duration-300 font-poppins"
            >
              <span className="relative z-10">Shop All</span>
              <motion.svg
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </motion.button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
