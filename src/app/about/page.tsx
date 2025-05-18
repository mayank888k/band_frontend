"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PublicPageWrapper from "@/components/PublicPageWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";

export default function AboutPage() {
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
                <span className="text-[#124E66]">About</span> Modern Band
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
                Discover our journey from Mainpuri since 2005, our core values of excellence and passion, and our expertise in traditional Uttar Pradesh wedding ceremonies.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h2 className="mb-6 text-3xl md:text-4xl">Our Story</h2>
                <p className="mb-4 text-lg text-secondary/70">
                  Modern Band was started in 2005 by Arvindra Kumar right here in Mainpuri, with a simple goal — to make weddings and celebrations truly unforgettable.
                </p>
                <p className="mb-4 text-lg text-secondary/70">
                  What began as a small dream has now grown into one of the city's most trusted and loved wedding bands. Known for our energetic performances, talented team, and top-notch service, we bring life, music, and joy to every event.
                </p>
                <p className="text-lg text-secondary/70">
                  Whether it's a grand wedding procession or a festive celebration, Modern Band is here to make your special moments even more magical!
                </p>
              </motion.div>
              <motion.div 
                className="rounded-lg h-70 shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <OptimizedImage 
                  src="/images/about_image_1.png" 
                  alt="Modern Band's Journey" 
                  width={800} 
                  height={600}
                  className="object-cover w-full h-full"
                  isAboveFold={true}
                  isHeroImage={true}
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Our Values Section */}
        <section className="section bg-[hsl(var(--muted)/0.3)]">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl md:text-4xl">Our Values</h2>
              <p className="text-lg text-secondary/70 max-w-3xl mx-auto">
                What sets Modern Band apart from the rest
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <motion.div 
                className="bg-white rounded-lg p-8 shadow-md border-t-4 border-[hsl(var(--primary))]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <motion.h3 
                  className="mb-3 text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Excellence
                </motion.h3>
                <motion.p 
                  className="text-secondary/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  We strive for musical excellence in every performance, ensuring the highest quality entertainment for your special day.
                </motion.p>
              </motion.div>
              
              {/* Value 2 */}
              <motion.div 
                className="bg-white rounded-lg p-8 shadow-md border-t-4 border-[hsl(var(--accent))]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[hsl(var(--accent)/0.1)] rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[hsl(var(--accent))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </motion.div>
                <motion.h3 
                  className="mb-3 text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  Customer Focus
                </motion.h3>
                <motion.p 
                  className="text-secondary/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  Your vision is our priority. We work closely with you to understand your preferences and create a customized experience.
                </motion.p>
              </motion.div>
              
              {/* Value 3 */}
              <motion.div 
                className="bg-white rounded-lg p-8 shadow-md border-t-4 border-[hsl(var(--primary))]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div 
                  className="w-16 h-16 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <motion.h3 
                  className="mb-3 text-xl font-semibold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Passion
                </motion.h3>
                <motion.p 
                  className="text-secondary/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  We genuinely love what we do, and that passion translates into energetic, engaging performances that get everyone dancing.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cultural Expertise Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-3xl md:text-4xl">Cultural Expertise</h2>
              <p className="text-lg text-secondary/70 max-w-3xl mx-auto">
                Preserving and celebrating the rich wedding traditions of Uttar Pradesh
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="rounded-lg h-70 shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <OptimizedImage 
                  src="/images/about_image_2.png" 
                  alt="Traditional Wedding Performance" 
                  width={800} 
                  height={500}
                  className="object-cover w-full h-full"
                  fadeIn={true}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h3 className="mb-4 text-2xl font-semibold text-[hsl(var(--primary))]">Honoring Mainpuri's Traditions</h3>
                <p className="mb-4 text-lg text-secondary/70">
                  As proud residents of Mainpuri, we understand the unique wedding customs of our region. Our performances respectfully incorporate traditional Uttar Pradesh elements, from classical dhol rhythms to folk melodies that have been celebrated for generations.
                </p>
                <p className="mb-4 text-lg text-secondary/70">
                  We specialize in authentic music for every ceremony - from the energetic baraat procession to the emotional vidaai. Our repertoire includes traditional wedding songs from Braj, Awadhi, and Bhojpuri traditions that deeply resonate with local families.
                </p>
                <p className="text-lg text-secondary/70">
                  While we embrace our rich heritage, we also blend modern elements seamlessly to create performances that appeal to all generations. This perfect balance is what makes us the preferred choice for Mainpuri families planning their special celebrations.
                </p>
              </motion.div>
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