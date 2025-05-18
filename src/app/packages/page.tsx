"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PublicPageWrapper from "@/components/PublicPageWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Base64 encoded tiny placeholder image - used as ultimate fallback
const PLACEHOLDER_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNM+g8AAV0BKUZUhVQAAAAASUVORK5CYII=";

export default function PackagesPage() {
  // Helper function to handle image errors with multiple fallbacks
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbacks: string[]) => {
    const target = e.target as HTMLImageElement;
    
    // Get current source and find its index in fallbacks
    const currentSrc = target.src;
    const currentIndex = fallbacks.findIndex(src => currentSrc.includes(src.split('/').pop() || ''));
    
    // If we have more fallbacks to try
    if (currentIndex < fallbacks.length - 1) {
      target.src = fallbacks[currentIndex + 1];
    } else {
      // Use base64 as ultimate fallback
      target.src = PLACEHOLDER_BASE64;
      target.onerror = null; // Prevent further errors
    }
  };

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
                <span className="text-[#124E66]">Our</span> Packages
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
                Choose from our carefully curated packages designed to make your celebration extraordinary.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Baraat Band Package */}
        <section id="baraat" className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-sm font-medium mb-4">Most Popular</span>
                <h2 className="mb-6 text-3xl md:text-4xl">Baraat Band Package</h2>
                <p className="mb-4 text-lg text-secondary/70">
                  Make a grand entrance with our traditional baraat band that brings energy and excitement to your wedding procession.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>2-hour baraat performance</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>30+ people including 16 musicians</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>8+ Modern Pillar lights</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Decorated Royal Baggi or Ghodi</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fireworks, Flower Canon, and more</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Mix of Bollywood, Punjabi, and classical music</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-[hsl(var(--primary))]">₹30,000</span>
                  <span className="text-lg text-secondary/70">starting price</span>
                </div>
                <Link href="/booking?package=baraat" className="btn btn-lg btn-primary">
                  Book This Package
                </Link>
              </div>
              <div className="order-1 md:order-2 rounded-lg h-70 overflow-hidden">
                <OptimizedImage 
                  src="/images/package_image1.jpg" 
                  alt="Baraat Band Performance" 
                  width={800} 
                  height={1000}
                  className="object-cover w-full h-full"
                  isAboveFold={true}
                  isHeroImage={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* DJ Band Package */}
        <section id="djBand" className="section bg-[hsl(var(--muted)/0.3)]">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg h-70 overflow-hidden">
                <OptimizedImage 
                  src="/images/package_image2.jpg" 
                  alt="DJ Band Performance"
                  width={800} 
                  height={1000}
                  className="object-cover w-full h-full"
                  isAboveFold={true}
                  isHeroImage={true}
                />
              </div>
              <div>
                <h2 className="mb-6 text-3xl md:text-4xl">DJ Band Package</h2>
                <p className="mb-4 text-lg text-secondary/70">
                A grand wedding procession with a decorated DJ setup, dazzling lights, and electrifying music beats to set the celebration in motion
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>2-hour live DJ performance</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>8+ Modern Pillar lights</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Decorated Royal Baggi or Ghodi</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fireworks, Flower Canon, and more</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Mix of Bollywood, Punjabi, and classical music</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Professional sound system included</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Custom song requests welcomed</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-[hsl(var(--primary))]">₹20,000</span>
                  <span className="text-lg text-secondary/70">starting price</span>
                </div>
                <Link href="/booking?package=djBand" className="btn btn-lg btn-primary">
                  Book This Package
                </Link>
              </div>
            </div>
          </div>
        </section>
        

        {/* Reception / Sangeet / Haldi / Mehendi Package */}
        <section id="reception" className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="mb-6 text-3xl md:text-4xl">Reception / Sangeet / Haldi / Mehendi Package</h2>
                <p className="mb-4 text-lg text-secondary/70">
                Celebrate every shade of your wedding — from the vibrant Haldi to the dazzling Reception — with soulful melodies, festive rhythms, and unforgettable musical vibes
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>4+ hours of music throughout the day</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Trained DJ Artists</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Up to 10 musicians if needed</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Complete sound system for all venues</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-[hsl(var(--primary))]">₹25,000</span>
                  <span className="text-lg text-secondary/70">starting price</span>
                </div>
                <Link href="/booking?package=reception" className="btn btn-lg btn-primary">
                  Book This Package
                </Link>
              </div>
              <div className="order-1 md:order-2 rounded-lg h-70 overflow-hidden">
                <OptimizedImage 
                  src="/images/package_image3.png" 
                  alt="DJ Band Performance" 
                  width={800} 
                  height={1000}
                  className="object-cover w-full h-full"
                  isAboveFold={true}
                  isHeroImage={true}
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Full Wedding package */}
        <section id="full-wedding" className="section bg-[hsl(var(--muted)/0.3)]">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg h-70 overflow-hidden">
                <OptimizedImage 
                  src="/images/package_image4.png" 
                  alt="DJ Band Performance" 
                  width={800} 
                  height={1000}
                  className="object-cover w-full h-full"
                  isAboveFold={true}
                  isHeroImage={true}
                />
              </div>
              <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] text-sm font-medium mb-4">Best Value</span>
                <h2 className="mb-6 text-3xl md:text-4xl">Full Wedding Package</h2>
                <p className="mb-4 text-lg text-secondary/70">
                Comprehensive music and entertainment for all your wedding events from morning to evening.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>8+ hours of music throughout the wedding</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Baraat, Haldi, Mehendi, and Reception coverage</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Complete sound system for all venues</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Mix of Bollywood, Punjabi, and classical music</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Professional sound system included</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[hsl(var(--accent))] mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>15% discount compared to booking separately</span>
                  </li>
                </ul>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-[hsl(var(--primary))]">₹80,000</span>
                  <span className="text-lg text-secondary/70">starting price</span>
                </div>
                <Link href="/booking?package=fullWedding" className="btn btn-lg btn-primary">
                  Book This Package
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Package */}
        <section id="custom" className="section bg-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="mb-6 text-3xl md:text-4xl">Need Something Custom?</h2>
              <p className="text-lg mb-8 text-secondary/70">
                We understand that every wedding is unique. Contact us to discuss your specific requirements and we'll create a custom package just for you.
              </p>
              <Link href="/contact" className="btn btn-lg btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-[hsl(var(--muted)/0.3)]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl md:text-4xl">Frequently Asked Questions</h2>
              <p className="text-lg text-secondary/70 max-w-3xl mx-auto">
                Get answers to common questions about our services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y">
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">How far in advance should I book your band?</h3>
                <p className="text-secondary/70">
                  We recommend booking at least 3-4 months in advance, especially for peak wedding season (October-February). For popular dates, even earlier is better.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Do you travel to different cities?</h3>
                <p className="text-secondary/70">
                  Yes, we perform across major cities in India. Travel and accommodation costs will be additional for locations outside Mainpuri.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Can we request specific songs?</h3>
                <p className="text-secondary/70">
                  Absolutely! We welcome song requests and will do our best to accommodate your favorites. Please provide your song list at least 2 weeks before the event.
                </p>
              </div>
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">What is your payment policy?</h3>
                <p className="text-secondary/70">
                  We require a 30% deposit to secure your date, with the balance due one week before the event. We accept bank transfers and online payments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
              <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl text-white">Ready to Book Modern Band?</h2>
              <div className="w-24 h-1 bg-[#748D92] mx-auto mb-6"></div>
              <p className="text-xl mb-8 text-white/90">
                Contact us today to check availability for your special day.
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