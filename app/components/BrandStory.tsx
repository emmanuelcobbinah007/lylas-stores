"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BrandStory = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform values for smooth fade transition
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0.8]
  );
  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, y }}
      className="min-h-[75vh] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Text Section - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8 text-center flex flex-col items-center"
        >
          <div className="max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight font-playfair"
            >
              Our Story
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-md lg:text-lg text-gray-700 leading-relaxed mb-8"
            >
              At LyLa's Stores, we believe every corner of your home deserves a
              touch of luxury. Our carefully selected pieces bring together
              exceptional craftsmanship, comfort, and timeless elegance.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-base text-gray-600 leading-relaxed"
            >
              From statement furniture to refined accessories, discover pieces
              that elevate your living spaces with sophisticated style and
              enduring quality.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center px-8 py-4 text-sm font-medium text-white bg-gray-900 rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-800 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center">
                  Read Our Story
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
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BrandStory;
