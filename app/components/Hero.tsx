"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LylaPic from "../../public/LylaPic.jpg";
import { blurDataURL } from "./ui/ImageShimmer";

interface HeroProps {
  activeSale?: {
    discountPercent: number;
    endDate?: Date;
  } | null;
}

const Hero = ({ activeSale }: HeroProps) => {
  // Dynamic content based on active sale
  const heroContent = activeSale
    ? {
        title: `STOREWIDE SALE - ${activeSale.discountPercent}% OFF`,
        subtitle: "Limited time offer on all items • Don't miss out!",
        buttonText: "Shop Sale",
        buttonLink: "/discover?category=on-sale",
        urgencyText: activeSale.endDate
          ? `Ends ${activeSale.endDate.toLocaleDateString()}`
          : "While supplies last",
      }
    : {
        title: "Welcome to LyLa's Stores",
        subtitle:
          "Discover timeless pieces that transform your space into a sanctuary of style and comfort",
        buttonText: "Shop Now",
        buttonLink: "/discover",
        urgencyText: null,
      };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <Image
            src={LylaPic}
            alt="Lyla's Stores Home Interior"
            priority
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="w-full h-[80vh] object-cover"
          />
        </motion.div>

        {/* Dynamic gradient overlay based on sale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className={`absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent`}
        ></motion.div>

        {/* Sale indicator badge */}

        {/* Hero Content */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            activeSale ? "w-[90%] sm:w-full mx-auto" : ""
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className={`text-center ${
              activeSale ? "text-white" : "text-gray-900"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className={`text-3xl md:text-5xl lg:text-6xl font-light font-playfair mb-6 ${
                activeSale ? "text-gray-700 drop-shadow-lg" : ""
              }`}
            >
              {heroContent.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              className={`text-lg md:text-xl font-poppins mb-4 max-w-2xl mx-auto text-gray-700`}
            >
              {heroContent.subtitle}
            </motion.p>

            {heroContent.urgencyText && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                className="text-gray-700 text-sm font-medium mb-6 drop-shadow-sm"
              >
                {heroContent.urgencyText}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
            >
              <Link href={heroContent.buttonLink}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl font-poppins bg-gray-900 text-white hover:bg-gray-800
                  `}
                >
                  {heroContent.buttonText}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
