import React from "react";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import FeaturedProducts from "./components/FeaturedProducts";
import InteriorInspiration from "./components/InteriorInspiration";
import NewsletterCTA from "./components/NewsletterCTA";
import { getActiveStorewideSale } from "@/../lib/getActiveStorewideSale";

const page = async () => {
  const activeSale = await getActiveStorewideSale();

  return (
    <div className="relative">
      <Hero activeSale={activeSale} />
      <BrandStory />
      <FeaturedProducts />
      <InteriorInspiration />
      <NewsletterCTA />
    </div>
  );
};

export default page;
