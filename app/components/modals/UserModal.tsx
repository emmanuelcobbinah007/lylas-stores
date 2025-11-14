"use client";

import React, { useState, useEffect } from "react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import {
  SigninForm,
  SignupForm,
  ForgotPasswordForm,
  LoggedInView,
} from "./user";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isMobileInline?: boolean;
};

type ViewState = "signin" | "signup" | "forgot-password" | "logged-in";

export default function UserModal({
  isOpen,
  onClose,
  isMobileInline = false,
}: UserModalProps) {
  // Lock body scroll while user modal is open
  useLockBodyScroll(isOpen);
  const [currentView, setCurrentView] = useState<ViewState>("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone?: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      const { user } = response.data;
      setUser(user);
      setIsLoggedIn(true);
      setCurrentView("logged-in");
    } catch (error) {
      setIsLoggedIn(false);
      setCurrentView("signin");
    }
  };

  const resetModal = () => {
    setCurrentView("signin");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSignin = async (values: { email: string; password: string }) => {
    try {
      await axios.post("/api/auth/login", values);
      // Since login sets the cookie, check auth status
      await checkAuthStatus();
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  const handleSignup = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await axios.post("/api/auth/signup", {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
        storefront: "LYLA",
      });
      // Since signup sets the cookie, check auth status
      await checkAuthStatus();
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password reset email sent!");
      setCurrentView("signin");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setIsLoggedIn(false);
      setUser(null);
      setCurrentView("signin");
      onClose(); // Close the modal after logout
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      // Still reset locally
      setIsLoggedIn(false);
      setUser(null);
      setCurrentView("signin");
      onClose();
      toast.success("Logged out successfully!");
    }
  };

  const renderHeader = () => {
    const titles = {
      signin: "Welcome Back",
      signup: "Create Account",
      "forgot-password": "Reset Password",
      "logged-in": "My Account",
    };

    return (
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {(currentView === "signup" ||
              currentView === "forgot-password") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onClick={() => setCurrentView("signin")}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-xl font-playfair text-gray-900"
            >
              {titles[currentView]}
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
        >
          {(() => {
            switch (currentView) {
              case "signin":
                return (
                  <SigninForm
                    onSignin={handleSignin}
                    onSwitchToSignup={() => setCurrentView("signup")}
                    onSwitchToForgotPassword={() =>
                      setCurrentView("forgot-password")
                    }
                  />
                );
              case "signup":
                return (
                  <SignupForm
                    onSignup={handleSignup}
                    onSwitchToSignin={() => setCurrentView("signin")}
                  />
                );
              case "forgot-password":
                return (
                  <ForgotPasswordForm onForgotPassword={handleForgotPassword} />
                );
              case "logged-in":
                return user ? (
                  <LoggedInView
                    user={{
                      firstName: user.firstname,
                      lastName: user.lastname,
                      email: user.email,
                    }}
                    onLogout={handleLogout}
                    onClose={onClose}
                  />
                ) : null;
              default:
                return (
                  <SigninForm
                    onSignin={handleSignin}
                    onSwitchToSignup={() => setCurrentView("signup")}
                    onSwitchToForgotPassword={() =>
                      setCurrentView("forgot-password")
                    }
                  />
                );
            }
          })()}
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
            {renderHeader()}

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
          </motion.div>
        </>
      )}
      {isMobileInline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col max-h-[calc(100vh-200px)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0">{renderHeader()}</div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
