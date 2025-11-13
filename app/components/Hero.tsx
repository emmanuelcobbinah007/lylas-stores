"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LylaPic from "../../public/LylaPic.jpg";
import { blurDataURL } from "./ui/ImageShimmer";

const Hero = () => {
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
            alt="Lyla"
            priority
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="w-full h-[80vh] object-cover"
          />
        </motion.div>
        {/* Gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent"
        ></motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="text-center text-gray-900"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-light font-playfair mb-6"
            >
              Welcome to LyLa's Stores
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              className="text-lg md:text-xl text-gray-700 font-poppins mb-8 max-w-2xl mx-auto"
            >
              Discover timeless pieces that transform your space into a
              sanctuary of style and comfort
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
            >
              <Link href="/discover">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-poppins"
                >
                  Shop Now
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
