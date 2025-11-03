"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import LylaPic from "../../public/LylaPic.jpg";
import { blurDataURL } from "./ui/ImageShimmer";

const Hero = () => {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <Image
            src={LylaPic}
            alt="Lyla"
            priority
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="w-full h-[80vh] object-cover"
          />
        </motion.div>
        {/* Gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-transparent"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
