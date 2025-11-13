"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "already-subscribed"
  >("idle");
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(
    null
  );

  // check auth/me to prefill email if logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // check subscription when user is present
  useEffect(() => {
    const checkSubscription = async () => {
      if (user?.id || user?.email) {
        setIsCheckingSubscription(true);
        try {
          const query = user.id
            ? `userId=${user.id}`
            : `email=${encodeURIComponent(user.email!)}`;
          const res = await fetch(`/api/newsletter?${query}`);
          const data = await res.json();
          if (data.isSubscribed) {
            setStatus("already-subscribed");
          } else if (user.email) {
            setEmail(user.email);
          }
        } catch (err) {
          if (user.email) setEmail(user.email);
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    checkSubscription();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId: user?.id || null }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("sent");
        setTimeout(() => {
          setStatus("already-subscribed");
          if (!user) setEmail("");
        }, 1500);
      } else {
        console.error("Subscription failed:", data.error || data.message);
        setStatus("idle");
      }
    } catch (err) {
      console.error("Error subscribing:", err);
      setStatus("idle");
    }
  };

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white via-[#f8f6f3] to-[#f5f2ed]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 font-playfair leading-tight"
          >
            {status === "already-subscribed"
              ? "You're already subscribed!"
              : "Join the LyLa Circle"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto font-poppins"
          >
            {status === "already-subscribed"
              ? "Thanks for being part of LyLa! You'll be the first to know about new arrivals and exclusive deals."
              : "Exclusive access to new arrivals, limited collections, and special member pricing. Be the first to shop our latest luxury pieces."}
          </motion.p>
        </motion.div>

        {status === "already-subscribed" ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium truncate md:whitespace-normal md:overflow-visible">
                {user
                  ? `Subscribed with ${user.email}`
                  : "Successfully subscribed!"}
              </p>
            </div>
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <form
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  user ? "Your email is pre-filled" : "Enter your email address"
                }
                className="block md:flex-1 px-4 py-3 rounded-lg text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white border-2 border-white"
                disabled={status === "sending" || isCheckingSubscription}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50"
                disabled={
                  status === "sending" || isCheckingSubscription || !email
                }
              >
                {isCheckingSubscription
                  ? "Checking..."
                  : status === "sending"
                  ? "Subscribing..."
                  : status === "sent"
                  ? "Subscribed!"
                  : "Subscribe"}
              </button>
            </form>
          </motion.div>
        )}

        {status === "sent" && (
          <motion.div variants={itemVariants} className="mt-4">
            <p className="mt-4 text-gray-700">
              Welcome to the LyLa Circle! Check your email for updates.
            </p>
          </motion.div>
        )}

        {user && status !== "already-subscribed" && (
          <motion.div variants={itemVariants} className="mt-4">
            <p className="mt-4 text-gray-700 text-sm">
              You're logged in as {user.email}
            </p>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-8 text-xs text-gray-500 font-poppins"
        >
          We respect your privacy. Unsubscribe at any time. No spam, just
          exclusive offers and luxury home inspiration.
        </motion.p>
      </div>
    </section>
  );
};

export default NewsletterCTA;
