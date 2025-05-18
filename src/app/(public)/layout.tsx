"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PromoBanner 
        messages={[
          "🎵 Summer Special! 10% off all wedding band bookings for 2025",
          "🎸 Free dhol player with our Full Wedding Package",
          "✨ Limited time offer: Book now and get 2 extra fancy lights"
        ]}
        speed={1}
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
} 