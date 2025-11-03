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
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 font-playfair">
          About LyLa's Stores
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            At LyLa's Stores, we believe every corner of your home deserves a
            touch of class. Our carefully selected pieces bring together
            exceptional craftsmanship, comfort, and timeless elegance.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            Founded with a passion for luxury home decor, we curate an exclusive
            collection of furniture, lighting, textiles, and accessories from
            renowned artisans and premium manufacturers worldwide. Each piece is
            selected for its exceptional quality, sophisticated design, and
            ability to elevate any living space.
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            From statement furniture pieces to carefully crafted accessories,
            our collection spans contemporary luxury to timeless classics. We
            source directly from skilled craftspeople and established luxury
            brands, ensuring authenticity and the highest standards of quality
            in every piece we offer.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Whether you're creating a sophisticated living room, an elegant
            bedroom retreat, or updating your entire home, Lyia's Stores offers
            the luxury pieces you need to transform your space into a reflection
            of refined taste and comfort.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
