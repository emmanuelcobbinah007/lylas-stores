"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Mock lifestyle data - replace with your actual lifestyle photos
const lifestyleImages = [
  {
    id: 1,
    image: "/livingroominspi.jpg", // Replace with actual lifestyle images
    title: "Modern Minimalist Living",
    description: "Clean lines meet warm textures",
    featuredItems: ["Velvet Accent Chair", "Marble Coffee Table"],
    tags: ["#ModernHome", "#MinimalistStyle"],
  },
  {
    id: 2,
    image: "/kitcheninspi.jpg", // Replace with actual lifestyle images
    title: "Cozy Reading Nook",
    description: "A perfect corner for quiet moments",
    featuredItems: ["Brass Floor Lamp", "Cashmere Throw"],
    tags: ["#CozyVibes", "#ReadingNook"],
  },
  {
    id: 3,
    image: "/bedroominspi.jpg", // Replace with actual lifestyle images
    title: "Elegant Dining Space",
    description: "Where conversations flow like wine",
    featuredItems: ["Dining Table", "Pendant Light"],
    tags: ["#DiningRoom", "#Entertaining"],
  },
  {
    id: 4,
    image: "/bathroominspi.jpg", // Replace with actual lifestyle images
    title: "Serene Bedroom Retreat",
    description: "Your personal sanctuary awaits",
    featuredItems: ["Platform Bed", "Linen Bedding"],
    tags: ["#BedroomGoals", "#SereneSpaces"],
  },
  {
    id: 5,
    image: "/dininginspi.jpeg", // Replace with actual lifestyle images
    title: "Sun-Soaked Study",
    description: "Inspiration flows with natural light",
    featuredItems: ["Desk Chair", "Table Lamp"],
    tags: ["#HomeOffice", "#ProductiveSpaces"],
  },
  {
    id: 6,
    image: "/LylaPic.jpg", // Replace with actual lifestyle images
    title: "Warm Living Corner",
    description: "Where memories are made daily",
    featuredItems: ["Corner Sofa", "Side Table"],
    tags: ["#LivingRoom", "#FamilyTime"],
  },
];

const InteriorInspiration = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Gentler parallax transforms to reduce glitching
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 font-playfair"
          >
            Style Inspiration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins"
          >
            See how our luxury pieces transform real homes into stunning
            showcases of sophisticated living.
          </motion.p>
        </motion.div>

        {/* Lifestyle Grid with Parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {lifestyleImages.map((lifestyle, index) => {
            // Assign gentler parallax speeds to create subtle depth
            const parallaxY = index % 3 === 0 ? y1 : index % 3 === 1 ? y2 : y3;

            return (
              <motion.div
                key={lifestyle.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                className={`group cursor-pointer ${
                  index === 0 || index === 3 ? "lg:row-span-2" : ""
                }`}
              >
                <motion.div
                  style={{ y: parallaxY }}
                  className={`relative overflow-hidden rounded-2xl bg-gray-100 will-change-transform ${
                    index === 0 || index === 3 ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={lifestyle.image}
                    alt={lifestyle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    priority={index < 3}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      initial={{ y: 10 }}
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-3"
                    >
                      <h3 className="text-xl lg:text-2xl font-light font-playfair leading-tight">
                        {lifestyle.title}
                      </h3>
                      <p className="text-sm opacity-90 font-poppins leading-relaxed">
                        {lifestyle.description}
                      </p>

                      {/* Featured Items Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {lifestyle.featuredItems.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full font-poppins"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Style Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lifestyle.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs text-white/70 font-poppins"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-600 mb-8 font-poppins text-lg"
          >
            Ready to elevate your space?
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center px-10 py-4 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-poppins"
          >
            <span className="relative z-10">Explore Our Collection</span>
            <motion.svg
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default InteriorInspiration;
