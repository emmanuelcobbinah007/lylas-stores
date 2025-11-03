"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="my-14"></div>
      <main className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* 404 Number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-8xl md:text-9xl font-playfair text-gray-200 leading-none">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-playfair text-gray-900 mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 font-poppins leading-relaxed">
                We couldn't find the page you're looking for. It might have been
                moved, deleted, or you entered the wrong URL.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium transition-all duration-200 hover:bg-gray-800 font-poppins"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-900 font-poppins"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/discover"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium transition-all duration-200 hover:border-gray-400 hover:text-gray-900 font-poppins"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Products
                </Link>
              </motion.div>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 pt-8 border-t border-gray-200"
            >
              <h3 className="text-lg font-playfair text-gray-900 mb-6">
                Popular Pages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/discover"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-poppins"
                >
                  Discover
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-poppins"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-poppins"
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-poppins"
                >
                  FAQ
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
