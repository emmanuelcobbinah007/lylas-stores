"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* White overlay for clicking outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-40"
            onClick={onClose}
          />

          {/* User Panel - Slide in from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-playfair text-gray-900">Account</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Placeholder */}
            <div className="flex-1 p-6">
              <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-poppins text-sm">
                  User modal content will go here
                </p>
              </div>
            </div>

            {/* Footer placeholder for action buttons */}
            <div className="p-6 border-t border-gray-200">
              <div className="h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-poppins text-sm">
                  Login/Signup buttons area
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
