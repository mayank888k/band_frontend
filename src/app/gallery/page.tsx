"use client";

import { Suspense } from "react";
import GalleryContent from "@/components/gallery/GalleryContent";
import { ensureGalleryImages } from "@/lib/gallery";
import Link from "next/link";
import { motion } from "framer-motion";
import PublicPageWrapper from "@/components/PublicPageWrapper";

// Preload critical gallery images
const preloadImages = [
  "/images/gallery/gallery-1.jpg",
  "/images/gallery/gallery-2.jpg",
  "/images/gallery/gallery-3.jpg",
  "/images/gallery/gallery-5.jpg",
];

export default function GalleryPage() {
  return (
    <PublicPageWrapper>
      <div className="flex flex-col min-h-screen pt-24">
        {/* Hero Section */}
        <section className="relative flex items-center py-24">
          {/* Dark overlay with new color scheme */}
          <div className="absolute inset-0 bg-[#D3D9D4]/70 z-10"></div>
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat"></div>
          <div className="container relative z-20">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E3944]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <span className="text-[#124E66]">Our</span> Gallery
              </motion.h1>
              <motion.p 
                className="mb-8 text-xl text-[#2E3944]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                Browse our collection of performances and memorable moments.
              </motion.p>
            </motion.div>
          </div>
        </section>
        
        {/* Preload critical images */}
        {preloadImages.map((src) => (
          <link key={src} rel="preload" href={src} as="image" />
        ))}
        
        {/* Gallery Section - Client Component with Suspense */}
        <Suspense fallback={<GallerySkeleton />}>
          <GalleryContent />
        </Suspense>
        
        {/* Contact CTA */}
        <section className="py-16 bg-[#124E66] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="container relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl text-white">Want to See Us Live?</h2>
              <div className="w-24 h-1 bg-[#748D92] mx-auto mb-6"></div>
              <p className="text-xl mb-8 text-white/90">
                Book Modern Band for your upcoming event and create memories that will last a lifetime.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/booking" className="btn btn-lg bg-white text-[#124E66] hover:bg-white/90 shadow-lg">
                  Book Now
                </Link>
                <Link href="/contact" className="btn btn-lg border border-white hover:bg-white/10">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicPageWrapper>
  );
}

// Simple loading skeleton
function GallerySkeleton() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-2 rounded-full bg-gray-200 animate-pulse w-24 h-10"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow-md bg-white">
              <div className="bg-gray-200 animate-pulse h-64 w-full"></div>
              <div className="p-4">
                <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-2"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 