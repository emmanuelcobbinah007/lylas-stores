"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  category: string;
};

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Orders & Shipping",
    question: "What are your shipping options and delivery times?",
    answer:
      "We offer free standard shipping on orders over ₵150, which typically takes 5-7 business days. Express shipping (2-3 business days) is available for ₵25. For large furniture items, we provide white-glove delivery service with installation.",
  },
  {
    id: 2,
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within the United States and Canada. International shipping to select countries is available for smaller decor items. Please contact us for specific international shipping inquiries.",
  },
  {
    id: 3,
    category: "Orders & Shipping",
    question: "Can I track my order?",
    answer:
      "Yes! Once your order ships, you'll receive a tracking number via email. You can track your package directly through our website or the carrier's tracking system.",
  },
  {
    id: 4,
    category: "Products & Quality",
    question: "What materials do you use in your furniture?",
    answer:
      "We use only premium materials including solid hardwoods, high-grade metals, natural stone, and carefully selected fabrics. Each product page contains detailed material specifications and care instructions.",
  },
  {
    id: 5,
    category: "Products & Quality",
    question: "Do your products come with a warranty?",
    answer:
      "Yes, all our furniture comes with a 2-year warranty against manufacturing defects. Decor items have a 1-year warranty. Normal wear and tear is not covered, but we stand behind the quality of our craftsmanship.",
  },
  {
    id: 6,
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items in their original condition. Custom or personalized items are final sale. Return shipping is free for defective items; customer pays return shipping for other returns.",
  },
  {
    id: 7,
    category: "Returns & Exchanges",
    question: "How do I return or exchange an item?",
    answer:
      "Contact our customer service team to initiate a return. We'll provide you with a return authorization number and shipping instructions. Large furniture items require scheduling a pickup.",
  },
  {
    id: 8,
    category: "Design Services",
    question: "Do you offer interior design consultations?",
    answer:
      "Yes! We offer virtual design consultations with our in-house design team. Sessions start at ₵150 and can be applied toward your purchase of ₵500 or more.",
  },
  {
    id: 9,
    category: "Design Services",
    question: "Can you help me design an entire room?",
    answer:
      "Absolutely! Our design team specializes in complete room makeovers. We offer package deals for full room designs and can work within various budget ranges.",
  },
];

const categories = [
  "All",
  "Orders & Shipping",
  "Products & Quality",
  "Returns & Exchanges",
  "Design Services",
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs =
    activeCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="my-14"></div>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair leading-tight mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-gray-600 font-poppins">
                Find answers to common questions about our products, services,
                and policies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 font-poppins ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Items */}
        <section className="pb-16">
          <div className="container mx-auto px-6 md:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                {filteredFAQs.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-poppins">
                          {item.category}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 font-playfair">
                          {item.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: openItems.includes(item.id) ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 flex-shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openItems.includes(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5">
                            <p className="text-gray-700 leading-relaxed font-poppins">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-playfair mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 font-poppins mb-8">
                Our team is here to help. Get in touch and we'll respond as
                quickly as possible.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 hover:bg-gray-800 font-poppins"
              >
                Contact Us
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
