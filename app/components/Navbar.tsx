"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/#discover", label: "Discover" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      setIsMobileMenuOpen(true);
      // Small delay to trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const closeMobileMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300); // Match the transition duration
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "pt-2" : "pt-4"
      }`}
    >
      <div
        className={`container mx-auto transition-all duration-300 ${
          isScrolled ? "max-w-4xl" : "max-w-7xl"
        }`}
      >
        <nav
          className={`flex items-center justify-between px-6 py-3 transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-lg rounded-full shadow-lg border border-gray-200"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/Lyla’sLogoLight.png"
              alt="Prosupport Logo"
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-teal transition-colors duration-300 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Icons */}
          <div className="hidden md:flex items-center">
            <button
              className="p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen || isAnimating ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`fixed inset-0 backdrop-blur-lg bg-black/20 z-40 md:hidden transition-opacity duration-300 ease-out ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          ></div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
