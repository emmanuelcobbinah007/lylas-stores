import React from "react";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import FeaturedProducts from "./components/FeaturedProducts";
import InteriorInspiration from "./components/InteriorInspiration";
import NewsletterCTA from "./components/NewsletterCTA";

const page = () => {
  return (
    <div className="relative">
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <InteriorInspiration />
      <NewsletterCTA />
    </div>
  );
};

export default page;
