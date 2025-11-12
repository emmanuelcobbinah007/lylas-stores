"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import axios from "axios";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Product = {
  id: string;
  name: string;
  price: string; // API returns price as string with currency symbol
  image: string; // API returns single image URL, not array
  category: string; // API returns category as slug string
};

type Category = {
  id: string;
  name: string;
  subCategories: { id: string; name: string }[];
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("/api/products?limit=100"),
        axios.get("/api/categories"),
      ]);
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "") ||
      product.category?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  const handleProductClick = (productId: string) => {
    // Navigate to product page
    window.location.href = `/discover/${productId}`;
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to category page
    const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
    window.location.href = `/discover?category=${slug}`;
    onClose();
  };

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
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-poppins text-sm">
                          Loading...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Categories */}
                        {filteredCategories.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-900 font-poppins mb-3">
                              Categories
                            </h4>
                            <div className="space-y-2">
                              {filteredCategories.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() =>
                                    handleCategoryClick(category.name)
                                  }
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <Search className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                      <p className="font-poppins font-medium text-gray-900">
                                        {category.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Category
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Products */}
                        {filteredProducts.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 font-poppins mb-3">
                              Products
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                              {filteredProducts.slice(0, 8).map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product.id)}
                                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                >
                                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                                    {product.image ? (
                                      <>
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          onError={(e) => {
                                            e.currentTarget.style.display =
                                              "none";
                                            const placeholder = e.currentTarget
                                              .nextElementSibling as HTMLElement;
                                            if (placeholder)
                                              placeholder.classList.remove(
                                                "hidden"
                                              );
                                          }}
                                        />
                                        <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                          <span className="text-xs text-gray-400 font-poppins">
                                            IMG
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-400 font-poppins">
                                          IMG
                                        </span>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                  <div className="p-3">
                                    <h3 className="font-poppins font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                      {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium mb-1">
                                      {product.category
                                        ? product.category
                                            .split("-")
                                            .map(
                                              (word) =>
                                                word.charAt(0).toUpperCase() +
                                                word.slice(1)
                                            )
                                            .join(" ")
                                        : "Uncategorized"}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                      {product.price}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* No results */}
                        {searchQuery.length > 2 &&
                          filteredProducts.length === 0 &&
                          filteredCategories.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-gray-500 font-poppins text-sm">
                                No results found for "{searchQuery}"
                              </p>
                            </div>
                          )}
                      </>
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
