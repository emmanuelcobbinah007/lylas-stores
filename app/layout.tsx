import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lylasstores.lolyraced.com/"),
  title: {
    default: "Lyla's Stores - Elegant Home Furnishings",
    template: "%s | Lyla's Stores",
  },
  description:
    "Discover curated pieces that combine craftsmanship, comfort, and timeless design for your home at Lyla's Stores.",
  openGraph: {
    title: "Lyla's Stores - Elegant Home Furnishings",
    description:
      "Discover curated pieces that combine craftsmanship, comfort, and timeless design for your home.",
    url: "https://lylasstores.lolyraced.com/",
    siteName: "Lyla's Stores",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyla's Stores - Elegant Home Furnishings",
    description:
      "Discover curated pieces that combine craftsmanship, comfort, and timeless design for your home.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
