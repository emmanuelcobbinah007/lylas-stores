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
          {product.category && (
            <p className="text-sm text-gray-500 uppercase tracking-wider font-poppins">
              {product.category}
            </p>
          )}
          <h3 className="text-xl font-light text-gray-900 group-hover:text-gray-600 transition-colors duration-300 font-playfair">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed font-poppins">
              {product.description}
            </p>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}
