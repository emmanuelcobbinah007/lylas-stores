"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-12"></div>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
          About LyLa's Stores
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            At LyLa's Stores, we believe every corner of your home deserves a
            touch of elegance. Our curated pieces combine craftsmanship,
            comfort, and timeless design.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Founded with a passion for transforming spaces, we carefully select
            each piece in our collection to ensure it meets our high standards
            of quality and aesthetic appeal. From modern minimalist designs to
            classic statement pieces, we offer furniture and décor that speaks
            to diverse tastes while maintaining a cohesive sense of
            sophistication.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Our team travels the world to source unique pieces from skilled
            artisans and established manufacturers who share our commitment to
            excellence. We believe that great design should be accessible,
            durable, and meaningful – creating spaces that not only look
            beautiful but feel like home.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Whether you're furnishing your first apartment or redesigning a
            cherished family home, Lyia's Stores is here to help you create
            spaces that reflect your personality and enhance your daily life.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
