import React from "react";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import FeaturedProducts from "./components/FeaturedProducts";
import InteriorInspiration from "./components/InteriorInspiration";
import NewsletterCTA from "./components/NewsletterCTA";
import { getActiveStorewideSale } from "@/../lib/getActiveStorewideSale";

const page = async () => {
  const activeSale = await getActiveStorewideSale();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lyla's Stores",
    url: "https://lylasstores.lolyraced.com/",
    description: "Elegant Home Furnishings",
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero activeSale={activeSale} />
      <BrandStory />
      <FeaturedProducts />
      <InteriorInspiration />
      <NewsletterCTA />
    </div>
  );
};

export default page;
