"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import lylalogolight from "../../public/Lyla’sLogoLight.png";
import UserModal from "./modals/UserModal";
import CartModal from "./modals/CartModal";
import { blurDataURL } from "./ui/ImageShimmer";
import SearchModal from "./modals/SearchModal";

type CategoryItem = {
  label: string;
  href: string;
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDiscoverHovered, setIsDiscoverHovered] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartModalInitialView, setCartModalInitialView] = useState<
    "cart" | "checkout"
  >("cart");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<
    "menu" | "search" | "user" | "cart"
  >("menu");
  const [categories, setCategories] = useState<CategoryItem[]>([
    { href: "/discover?category=living-room", label: "Living Room" },
    { href: "/discover?category=bedroom", label: "Bedroom" },
    { href: "/discover?category=kitchen", label: "Kitchen" },
    { href: "/discover?category=bathroom", label: "Bathroom" },
    { href: "/discover?category=outdoor", label: "Outdoor" },
    { href: "/discover?category=decor", label: "Decor" },
    { href: "/discover?category=lighting", label: "Lighting" },
    { href: "/discover?category=storage", label: "Storage" },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (categoriesData) {
      const fetchedCategories: CategoryItem[] = categoriesData.map(
        (cat: any) => ({
          label: cat.name,
          href: `/discover?category=${
            cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")
          }`,
        })
      );
      setCategories(fetchedCategories);
    }
  }, [categoriesData]);

  // Handle buy now functionality
  useEffect(() => {
    const handleOpenCartModal = () => {
      openCartModal("checkout");
    };

    // Check if buy now was triggered
    const buyNowFlag = localStorage.getItem("buyNow");
    if (buyNowFlag === "true") {
      localStorage.removeItem("buyNow");
      openCartModal("checkout");
    }

    // Listen for cart modal open events
    window.addEventListener("openCartModal", handleOpenCartModal);

    return () => {
      window.removeEventListener("openCartModal", handleOpenCartModal);
    };
  }, []);

  const navItems = [
    { href: "/discover", label: "Discover" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileView("menu");
  };

  const openUserModal = () => {
    setIsUserModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  const openCartModal = (initialView: "cart" | "checkout" = "cart") => {
    setCartModalInitialView(initialView);
    setIsCartModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
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
          className={`flex items-center justify-between px-6 py-2 transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-200"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src={lylalogolight}
                alt="Prosupport Logo"
                width={160}
                height={160}
                priority
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-20 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex items-center space-x-6 relative"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut",
                }}
                className="relative"
                onMouseEnter={() =>
                  item.label === "Discover" && setIsDiscoverHovered(true)
                }
                onMouseLeave={() =>
                  item.label === "Discover" && setIsDiscoverHovered(false)
                }
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-[#c78e3a] transition-colors duration-300 font-medium relative group"
                  >
                    {item.label}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c78e3a] origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </Link>
                </motion.div>

                {/* Discover Dropdown */}
                {item.label === "Discover" && (
                  <AnimatePresence>
                    {isDiscoverHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-20 left-0 right-0 flex justify-center pt-4 z-50"
                        onMouseEnter={() => setIsDiscoverHovered(true)}
                        onMouseLeave={() => setIsDiscoverHovered(false)}
                      >
                        <div className="flex items-center justify-center space-x-8 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-lg shadow-lg border border-gray-200">
                          {categories.map((category, categoryIndex) => (
                            <motion.div
                              key={category.href}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: categoryIndex * 0.05,
                                ease: "easeOut",
                              }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <Link
                                  href={category.href}
                                  className="text-gray-700 hover:text-[#c78e3a] transition-colors duration-200 whitespace-nowrap font-medium"
                                >
                                  {category.label}
                                </Link>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Icons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="hidden md:flex items-center"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              onClick={openSearchModal}
              className="hover:cursor-pointer p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              onClick={openUserModal}
              className="hover:cursor-pointer p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
              onClick={() => openCartModal("cart")}
              className="hover:cursor-pointer p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary-teal transition-colors duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 backdrop-blur-lg bg-white/20 z-40 md:hidden"
              onClick={closeMobileMenu}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onClick={
                  mobileView === "menu"
                    ? closeMobileMenu
                    : () => setMobileView("menu")
                }
                className="absolute top-14 right-8 text-black hover:text-primary-teal transition-colors duration-300 text-xl"
                aria-label="Close menu"
              >
                ✕
              </motion.button>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex justify-center pt-20"
              >
                <Image
                  src={lylalogolight}
                  alt="Prosupport Logo"
                  width={160}
                  height={160}
                  priority
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  className="h-20 w-auto"
                />
              </motion.div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  {mobileView === "menu" ? (
                    <>
                      {/* Navigation Items */}
                      <div className="flex flex-col items-center justify-center space-y-6 mt-10 h-[50vh]">
                        {navItems.map((item, index) => (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.2 + index * 0.1,
                              duration: 0.4,
                            }}
                          >
                            <Link
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="text-black hover:text-primary-teal transition-colors duration-300 font-poppins font-medium text-lg"
                            >
                              {item.label}
                            </Link>
                          </motion.div>
                        ))}

                        {/* Action Icons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.4 }}
                          className="flex items-center space-x-6 mt-8"
                        >
                          <button
                            className="p-3 text-black hover:text-primary-teal transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileView("search");
                            }}
                            aria-label="Search"
                          >
                            <Search className="h-6 w-6" />
                          </button>
                          <button
                            className="p-3 text-black hover:text-primary-teal transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileView("user");
                            }}
                            aria-label="User account"
                          >
                            <User className="h-6 w-6" />
                          </button>
                          <button
                            className="p-3 text-black hover:text-primary-teal transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileView("cart");
                            }}
                            aria-label="Shopping cart"
                          >
                            <ShoppingCart className="h-6 w-6" />
                          </button>
                        </motion.div>
                      </div>
                    </>
                  ) : mobileView === "search" ? (
                    <SearchModal
                      isOpen={true}
                      onClose={() => setMobileView("menu")}
                      isMobileInline={true}
                    />
                  ) : mobileView === "user" ? (
                    <UserModal
                      isOpen={true}
                      onClose={() => setMobileView("menu")}
                      isMobileInline={true}
                    />
                  ) : mobileView === "cart" ? (
                    <CartModal
                      isOpen={true}
                      onClose={() => setMobileView("menu")}
                      isMobileInline={true}
                      initialView={cartModalInitialView}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        initialView={cartModalInitialView}
      />
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </header>
  );
};

export default Navigation;
