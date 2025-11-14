"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PaystackCheckoutProps {
  amount: number; // Amount in GHS
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaystackCheckout({
  amount,
  email,
  firstName,
  lastName,
  phone,
  onSuccess,
  onClose,
  disabled = false,
}: PaystackCheckoutProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack script dynamically
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup script
      const existingScript = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!isLoaded || !window.PaystackPop) {
      toast.error("Payment system not loaded. Please try again.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
      email,
      amount: amount * 100, // Convert to kobo
      currency: "GHS",
      ref: `LYLA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      metadata: {
        firstName,
        lastName,
        phone,
      },
      callback: (response: any) => {
        toast.success("Payment successful! Processing your order...");
        onSuccess(response.reference);
      },
      onClose: () => {
        toast.info("Payment cancelled");
        onClose();
      },
    });

    handler.openIframe();
  };

  if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
    return (
      <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg text-center font-poppins text-sm">
        Payment system not configured
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || !isLoaded}
      className={`w-full ${
        disabled || !isLoaded
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-900 hover:bg-gray-800"
      } text-white py-3 px-4 rounded-lg transition-colors duration-200 font-poppins font-medium`}
    >
      {isLoaded ? "Pay with Paystack" : "Loading payment..."}
    </button>
  );
}
