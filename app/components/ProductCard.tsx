"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { blurDataURL } from "./ui/ImageShimmer";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
  description?: string;
  isOnSale?: boolean;
  originalPrice?: string;
};

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <Link href={`/discover/${product.id}`}>
      <motion.div
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

          {/* Price overlay - shows on hover for larger screens */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center hidden sm:flex"
          >
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="text-lg font-medium text-gray-900 font-poppins">
                {product.price ? product.price : product.originalPrice}
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
          {product.category && (
            <p className="text-sm text-gray-500 uppercase tracking-wider font-poppins">
              {product.category}
            </p>
          )}
          <h3 className="text-xl font-light text-gray-900 group-hover:text-gray-600 transition-colors duration-300 font-playfair">
            {product.name}
          </h3>
          {product.description && (
            <p
              className="text-sm text-gray-600 leading-relaxed font-poppins"
              title={product.description}
            >
              {product.description
                ? product.description.length > 40
                  ? product.description.slice(0, 40).trimEnd() + "…"
                  : product.description
                : null}
            </p>
          )}
          {/* Price Display - always visible on mobile, hidden on larger screens */}
          <div className="flex items-center justify-center gap-2 sm:hidden">
            {product.price ? (
              <>
                <span className="text-sm text-gray-400 line-through font-poppins">
                  {product.originalPrice}
                </span>
                <span className="text-lg font-medium font-poppins text-red-600">
                  {product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-medium font-poppins text-gray-900">
                {product.originalPrice}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
