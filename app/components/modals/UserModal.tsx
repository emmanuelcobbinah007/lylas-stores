"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import {
  SigninForm,
  SignupForm,
  ForgotPasswordForm,
  LoggedInView,
} from "./user";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ViewState = "signin" | "signup" | "forgot-password" | "logged-in";

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const [currentView, setCurrentView] = useState<ViewState>("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const resetModal = () => {
    setCurrentView("signin");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSignin = async (values: { email: string; password: string }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login
      setUser({
        firstName: "John",
        lastName: "Doe",
        email: values.email,
      });
      setIsLoggedIn(true);

      // Add a small delay for smooth transition
      setTimeout(() => {
        setCurrentView("logged-in");
      }, 100);
    } catch (error) {
      console.error("Signin error:", error);
    }
  };

  const handleSignup = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      setUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });
      setIsLoggedIn(true);

      // Add a small delay for smooth transition
      setTimeout(() => {
        setCurrentView("logged-in");
      }, 100);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Password reset email sent!");
      setCurrentView("signin");
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView("signin");
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
                    onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
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
                  <LoggedInView user={user} onLogout={handleLogout} />
                ) : null;
              default:
                return (
                  <SigninForm
                    onSignin={handleSignin}
                    onSwitchToSignup={() => setCurrentView("signup")}
                    onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
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
      {isOpen && (
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
    </AnimatePresence>
  );
}
