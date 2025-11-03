"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import lylalogolight from "../../public/Lyla’sLogoLight.png";
import AuroraLogo from "../../public/AuroraLogo.png";
import { blurDataURL } from "./ui/ImageShimmer";

const Footer = () => {
  const quickLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  const socialLinks = [
    {
      href: "https://instagram.com",
      label: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
        </svg>
      ),
    },
    {
      href: "https://pinterest.com",
      label: "Pinterest",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.082.343-.09.369-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
        </svg>
      ),
    },
    {
      href: "https://facebook.com",
      label: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src={lylalogolight}
                alt="LyLa's Stores Logo"
                width={120}
                height={120}
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-16 w-auto opacity-90"
              />
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-1"
          >
            {quickLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-poppins text-sm font-medium px-3 py-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
                {index < quickLinks.length - 1 && (
                  <span className="text-gray-400 mx-1">·</span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex items-center space-x-6"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                whileHover={{ y: -2, scale: 1.1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-gray-600 font-playfair text-lg font-light italic text-center"
          >
            Curated living, delivered with grace.
          </motion.p>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-gray-200 w-full text-center"
          >
            <p className="text-xs text-gray-500 font-poppins">
              © {new Date().getFullYear()} LyLa's Stores. All rights reserved.
            </p>
          </motion.div>
          <motion.div>
            <Link
              href="https://aurorasoftwarelabs.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={AuroraLogo}
                alt="Aurora Logo"
                width={120}
                height={120}
                placeholder="blur"
                blurDataURL={blurDataURL}
                className="h-30 w-auto opacity-90"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
