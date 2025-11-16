"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Star,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";

type ProductDetailsProps = {
  product: {
    id: string;
    name: string;
    price?: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    description: string;
    features: string[];
    inStock: boolean;
    category: string;
    images: string[];
  };
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product.inStock) return;

    setIsAddingToCart(true);
    try {
      // Check if user is authenticated
      const authResponse = await axios.get("/api/auth/me");
      if (!authResponse.data.user) {
        toast.error("Please log in to add items to your cart");
        return;
      }

      // Add to cart
      const response = await axios.post("/api/cart", {
        productId: product.id,
        quantity,
      });

      if (response.data.cart) {
        toast.success(`${quantity} ${product.name} added to cart!`);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please log in to add items to your cart");
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log(`Buy Now clicked for ${quantity} of ${product.name}`);
    // Could redirect to checkout or process immediate purchase
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - ${product.description}`,
      text: "",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        // Try to share with image if available
        if (product.images && product.images.length > 0) {
          const imageUrl = product.images[0];
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `${product.name}-thumbnail.jpg`, {
            type: blob.type,
          });
          await navigator.share({
            ...shareData,
            files: [file],
          });
        } else {
          await navigator.share(shareData);
        }
      } catch (error) {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-poppins">
          <span className="uppercase tracking-wider">{product.category}</span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair text-gray-900 mb-4">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-poppins">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          {product.price ? (
            <>
              <span className="text-2xl md:text-3xl font-playfair text-gray-900">
                {product.price}
              </span>
              <span className="text-lg text-gray-500 line-through font-poppins">
                {product.originalPrice}
              </span>
            </>
          ) : (
            <span className="text-2xl md:text-3xl font-playfair text-gray-900">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-8">
          {product.inStock ? (
            <span className="text-green-600 font-medium font-poppins">
              In Stock
            </span>
          ) : (
            <span className="text-red-600 font-medium font-poppins">
              Out of Stock
            </span>
          )}
        </div>
      </motion.div>

      {/* Add to Cart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 font-poppins">
            Quantity:
          </span>
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-12 text-center font-poppins">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gray-900 text-white py-4 px-6 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-poppins"
          >
            {isAddingToCart
              ? "Adding..."
              : product.inStock
              ? "Add to Cart"
              : "Out of Stock"}
          </motion.button>

          <div className="flex gap-2">
            <motion.button
              onClick={handleBuyNow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-400 flex items-center gap-2 transition-all duration-200 font-poppins text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Now
            </motion.button>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-400 flex items-center justify-center transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Product Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-playfair text-gray-900">Key Features</h3>
        <ul className="space-y-2">
          {product.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-gray-700 font-poppins"
            >
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-playfair text-gray-900">Description</h3>
        <p className="text-gray-700 leading-relaxed font-poppins whitespace-pre-wrap">
          {product.description}
        </p>
      </motion.div>

      {/* Shipping & Returns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="border-t border-gray-200 pt-8 space-y-4"
      >
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 font-poppins">
                Free Shipping
              </p>
              <p className="text-sm text-gray-600 font-poppins">
                On orders over ₵150
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 font-poppins">
                Easy Returns
              </p>
              <p className="text-sm text-gray-600 font-poppins">
                30-day return policy
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 font-poppins">
                2-Year Warranty
              </p>
              <p className="text-sm text-gray-600 font-poppins">
                Quality guarantee
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
