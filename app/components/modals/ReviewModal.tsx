"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import { X, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  images: { url: string }[];
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  unreviewedProducts: Product[];
  onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  orderId,
  unreviewedProducts,
  onReviewSubmitted,
}) => {
  // Lock body scroll while modal is open to prevent background scrolling / overscroll on mobile
  useLockBodyScroll(isOpen);

  const [isVisible, setIsVisible] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const currentProduct = unreviewedProducts[currentProductIndex];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentProductIndex(0);
      setRating(0);
      setComment("");
      setHoveredRating(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    console.log("The modal is closing");
    setIsVisible(false);
    // Delay calling onClose to allow exit animation to complete
    setTimeout(() => {
      onClose();
    }, 300); // Match the transition duration
  };

  const handleSubmitReview = async () => {
    if (!currentProduct || rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/reviews", {
        orderId,
        productId: currentProduct.id,
        rating,
        comment: comment.trim() || null,
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");

        if (currentProductIndex < unreviewedProducts.length - 1) {
          // Move to next product
          setCurrentProductIndex(currentProductIndex + 1);
          setRating(0);
          setComment("");
          setHoveredRating(0);
        } else {
          // All reviews submitted
          onReviewSubmitted();
          handleClose();
        }
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentProductIndex < unreviewedProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
      setRating(0);
      setComment("");
      setHoveredRating(0);
    } else {
      handleClose();
    }
  };

  if (!currentProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className="shadow-xl bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 font-playfair">
                  Leave a Review
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="text-sm text-gray-600 font-poppins">
                  Product {currentProductIndex + 1} of{" "}
                  {unreviewedProducts.length}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentProductIndex + 1) /
                          unreviewedProducts.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Image
                    src={
                      currentProduct.images?.[0]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={currentProduct.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 font-playfair">
                      {currentProduct.name}
                    </h3>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Rating *
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-poppins"
                    rows={4}
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleSkip}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium font-poppins"
                    disabled={isSubmitting}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={rating === 0 || isSubmitting}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium font-poppins"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
