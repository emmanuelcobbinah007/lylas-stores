"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* White overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-40"
            onClick={onClose}
          />

          {/* Floating Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg font-poppins text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {/* Placeholder results */}
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Sample Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵299.00
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Another Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵159.00
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Third Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵89.00
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Fourth Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵425.00
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Fifth Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵180.00
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            Sixth Product
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            ₵95.00
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* No results state */}
                    {searchQuery.length > 2 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 font-poppins text-sm">
                          No products found for "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
