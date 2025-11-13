"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";

type CartItem = {
  id: string;
  quantity: number;
  size: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
  };
};

type Cart = {
  id: string;
  cartItems: CartItem[];
};

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isMobileInline?: boolean;
};

type ViewState = "cart" | "checkout";

export default function CartModal({
  isOpen,
  onClose,
  isMobileInline = false,
}: CartModalProps) {
  const [currentView, setCurrentView] = useState<ViewState>("cart");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserAndCart();
    }
  }, [isOpen]);

  const fetchUserAndCart = async () => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const { user } = await userRes.json();
        setUser(user);
        setIsLoggedIn(true);

        // Fetch cart
        const cartRes = await fetch(`/api/cart?userId=${user.id}`);
        if (cartRes.ok) {
          const { cart: cartData } = await cartRes.json();
          setCart(cartData);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user/cart:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (!cart || !user) return;

    if (newQuantity === 0) {
      await removeItem(id);
      return;
    }

    try {
      // Update local state
      setCart((prev) =>
        prev
          ? {
              ...prev,
              cartItems: prev.cartItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
              ),
            }
          : null
      );

      // TODO: Call API to update in DB
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id: string) => {
    if (!cart || !user) return;

    try {
      setCart((prev) =>
        prev
          ? {
              ...prev,
              cartItems: prev.cartItems.filter((item) => item.id !== id),
            }
          : null
      );

      // TODO: Call API to remove from DB
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalPrice = () => {
    return (cart?.cartItems || []).reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return (cart?.cartItems || []).reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const handleClose = () => {
    setCurrentView("cart");
    onClose();
  };

  const renderCheckoutView = () => {
    const items = cart?.cartItems || [];

    return (
      <>
        {/* Checkout Form */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-poppins font-medium text-gray-900 mb-3">
                Order Summary
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-poppins">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-poppins">
                      ₵{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-poppins font-semibold">
                    <span>Total</span>
                    <span>₵{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="font-poppins font-medium text-gray-900 mb-3">
                Shipping Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                />
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Postal code"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="font-poppins font-medium text-gray-900 mb-3">
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 font-poppins text-sm"
                />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-gray-600 font-poppins">
                  Secure Payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-poppins">
                  Free Shipping
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <X className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 font-poppins">
                  Easy Returns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Actions */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={() => {
              // Simulate order placement
              toast.success("Order placed successfully!");
              setCart(null);
              setCurrentView("cart");
              handleClose();
            }}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-poppins font-medium"
          >
            Place Order - ₵{getTotalPrice().toFixed(2)}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2 font-poppins">
            By placing your order, you agree to our Terms of Service and Privacy
            Policy
          </p>
        </div>
      </>
    );
  };

  const renderCartView = () => {
    const items = cart?.cartItems || [];

    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-poppins">Loading cart...</p>
          </div>
        </div>
      );
    }

    if (isLoggedIn === false) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
              Please log in to view your cart
            </h3>
            <p className="text-gray-500 font-poppins text-sm">
              Sign in to access your shopping cart
            </p>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-poppins font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 font-poppins text-sm">
              Add some beautiful items to get started
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Cart Items */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400 font-poppins">
                        IMG
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-poppins font-medium text-gray-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-poppins">
                    {item.product.category.name}
                  </p>
                  <p className="text-lg font-poppins font-semibold text-gray-900 mt-1">
                    ₵{item.product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-poppins font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart Summary & Checkout */}
        <div className="p-6 border-t border-gray-200 space-y-4">
          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-poppins">
              <span className="text-gray-600">Items ({getTotalItems()})</span>
              <span className="text-gray-900">
                ₵{getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-poppins">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <div className="flex justify-between font-poppins font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  ₵{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => setCurrentView("checkout")}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-poppins font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </>
    );
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "tween",
          }}
          className="flex flex-col h-full"
        >
          {currentView === "cart" ? renderCartView() : renderCheckoutView()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && !isMobileInline && (
        <>
          {/* White overlay for clicking outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-40"
            onClick={handleClose}
          />

          {/* Cart Panel - Slide in from right */}
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
            {/* Dynamic Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {currentView === "checkout" && (
                  <button
                    onClick={() => setCurrentView("cart")}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentView}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-playfair text-gray-900"
                  >
                    {currentView === "cart" ? "Shopping Cart" : "Checkout"}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </motion.div>
        </>
      )}
      {isMobileInline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col h-full"
        >
          {/* Dynamic Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {currentView === "checkout" && (
                <button
                  onClick={() => setCurrentView("cart")}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentView}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-playfair text-gray-900"
                >
                  {currentView === "cart" ? "Shopping Cart" : "Checkout"}
                </motion.h2>
              </AnimatePresence>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
