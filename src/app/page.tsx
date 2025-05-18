"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ServiceCard from "@/components/ServiceCard";
import PublicPageWrapper from "@/components/PublicPageWrapper";

// Hero section animation variants with enhanced effects
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier curve for smoother motion
      delayChildren: 0.1,
      staggerChildren: 0.12
    }
  }
};

// Title text variant with letter animation
const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

// Paragraph text variant
const paragraphVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

// Button container variant
const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

// Individual button variant
const buttonVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      type: "spring",
      stiffness: 100
    }
  }
};

export default function HomePage() {
  return (
    <PublicPageWrapper>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen w-full pt-[calc(var(--promo-banner-height)+var(--navbar-height))] flex items-center text-white">
          {/* Dark overlay - increased opacity for better text visibility */}
          <div className="absolute inset-0 bg-[#212A31]/70 z-10"></div>
          {/* Background image with blur effect */}
          <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat"></div>
          <div className="container relative z-20">
            <motion.div 
              className="max-w-3xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="mb-5 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                variants={titleVariants}
              >
                <motion.span 
                  className="text-[#748D92] inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.1
                    }
                  }}
                >
                  Elevate
                </motion.span>{" "}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.2
                    }
                  }}
                >
                  Your Wedding
                </motion.span>{" "}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.7,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: 0.3
                    }
                  }}
                >
                  Celebration
                </motion.span>
              </motion.h1>
              <motion.p 
                className="mb-10 text-xl text-white/90"
                variants={paragraphVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                Experience the finest traditional wedding band services for your special day. Our performers bring energy, culture, and joy to your celebration.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-5"
                variants={buttonContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/booking" className="hero-btn btn-primary">
                    Book Now
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/packages" className="hero-btn text-white border-2 border-white hover:bg-white/20 backdrop-blur-sm">
                    See Packages
                  </Link>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/gallery" className="hero-btn bg-[#748D92] text-white hover:bg-[#748D92]/90">
                    Watch Videos
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Animated scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: [0, 10, 0]
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: 1.2 },
              y: { repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 1.2 }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We offer a comprehensive range of band services for all types of wedding celebrations, ensuring your special day is filled with music and joy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <ServiceCard 
                title="Baraat Procession"
                description="An unforgettable groom’s procession featuring a royally decorated baggi, dazzling fancy lights, and best of the best musicians."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                }
                color="bg-[hsl(var(--primary)/0.1)]"
                textColor="text-[hsl(var(--primary))]"
                borderColor="border-[hsl(var(--primary))]"
                link="/packages#baraat"
                index={0}
              />
              
              <ServiceCard 
                title="DJ Band Services"
                description="Modern DJ band services with high-energy performances for Baraat and celebrations with the perfect blend of fancy lights and music."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[hsl(var(--accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                }
                color="bg-[hsl(var(--accent)/0.1)]"
                textColor="text-[hsl(var(--accent))]"
                borderColor="border-[hsl(var(--accent))]"
                link="/packages#djBand"
                index={1}
              />
              
              <ServiceCard 
                title="Wedding Events"
                description="Traditional Band and DJ band services for Haldi, Mehendi and Sangeet ceremonies, enhancing the spiritual and cultural significance of every celebration."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                }
                color="bg-[hsl(var(--primary)/0.1)]"
                textColor="text-[hsl(var(--primary))]"
                borderColor="border-[hsl(var(--primary))]"
                link="/packages#reception"
                index={2}
              />
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
              <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl text-white">Make Your Wedding Unforgettable</h2>
              <div className="w-24 h-1 bg-[#748D92] mx-auto mb-6"></div>
              <p className="text-xl mb-8 text-white/90">
                Book Modern Band today to add magic and energy to your special celebration.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/booking" className="btn-lg bg-white text-[#124E66] hover:bg-white/90 shadow-lg py-3 px-6 rounded-md font-medium inline-block">
                    Book Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/packages" className="btn-lg border border-white hover:bg-white/10 py-3 px-6 rounded-md font-medium inline-block">
                    View Packages
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Rest of the homepage content */}
        {/* ... */}
      </div>
    </PublicPageWrapper>
  );
}
