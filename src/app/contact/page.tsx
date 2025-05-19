"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PublicPageWrapper from "@/components/PublicPageWrapper";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    message: ""
  });
  
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    phone: false,
    event_type: false,
    message: false
  });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFocus = (field: string) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };
  
  const handleBlur = (field: string) => {
    setFocused(prev => ({ ...prev, [field]: false }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Thank you for your message! We'll get back to you soon.");
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
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
                <span className="text-[#124E66]">Get in</span> Touch
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
                Have questions? We're here to help. Reach out to us for any inquiries about our services.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section bg-white py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <h2 className="mb-6 text-3xl md:text-4xl font-bold text-[hsl(var(--primary))]">Send Us a Message</h2>
                <p className="mb-6 text-lg text-secondary/70">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <motion.form 
                  className="space-y-5"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  onSubmit={handleSubmit}
                >
                  <motion.div variants={item}>
                    <label 
                      htmlFor="name" 
                      className={`block mb-2 font-medium transition-all duration-300 ${focused.name ? 'text-[hsl(var(--primary))]' : ''}`}
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all ${focused.name ? 'border-[hsl(var(--primary))]' : ''}`}
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div variants={item}>
                      <label 
                        htmlFor="email" 
                        className={`block mb-2 font-medium transition-all duration-300 ${focused.email ? 'text-[hsl(var(--primary))]' : ''}`}
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all ${focused.email ? 'border-[hsl(var(--primary))]' : ''}`}
                        placeholder="Enter your email"
                        required
                      />
                    </motion.div>
                    
                    <motion.div variants={item}>
                      <label 
                        htmlFor="phone"
                        className={`block mb-2 font-medium transition-all duration-300 ${focused.phone ? 'text-[hsl(var(--primary))]' : ''}`}
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all ${focused.phone ? 'border-[hsl(var(--primary))]' : ''}`}
                        placeholder="Enter your phone number"
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div variants={item}>
                    <label 
                      htmlFor="event_type"
                      className={`block mb-2 font-medium transition-all duration-300 ${focused.event_type ? 'text-[hsl(var(--primary))]' : ''}`}
                    >
                      Event Type
                    </label>
                    <select
                      id="event_type"
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleChange}
                      onFocus={() => handleFocus('event_type')}
                      onBlur={() => handleBlur('event_type')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all ${focused.event_type ? 'border-[hsl(var(--primary))]' : ''}`}
                    >
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="sangeet">Sangeet Night</option>
                      <option value="reception">Reception</option>
                      <option value="baraat">Baraat</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="other">Other</option>
                    </select>
                  </motion.div>
                  
                  <motion.div variants={item}>
                    <label 
                      htmlFor="message"
                      className={`block mb-2 font-medium transition-all duration-300 ${focused.message ? 'text-[hsl(var(--primary))]' : ''}`}
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus('message')}
                      onBlur={() => handleBlur('message')}
                      rows={4}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent transition-all ${focused.message ? 'border-[hsl(var(--primary))]' : ''}`}
                      placeholder="Tell us about your event and requirements"
                      required
                    ></textarea>
                  </motion.div>
                  
                  <motion.div 
                    variants={item}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <motion.button
                      type="submit"
                      className="btn btn-lg btn-primary shadow-lg hover:translate-y-[-2px] transition-transform flex-1"
                      whileHover={{ 
                        boxShadow: "0 10px 15px -3px rgba(18, 78, 102, 0.2), 0 4px 6px -2px rgba(18, 78, 102, 0.1)" 
                      }}
                    >
                      Send Message
                    </motion.button>
                    
                    <a
                      href="https://wa.me/919412308386?text=Hello%20Modern%20Band%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-lg bg-[#25D366] text-white shadow-lg hover:translate-y-[-2px] transition-transform flex-1 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Chat on WhatsApp
                    </a>
                  </motion.div>
                </motion.form>
              </motion.div>
              
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 md:order-2"
              >
                <h2 className="mb-6 text-3xl md:text-4xl font-bold text-[hsl(var(--primary))]">Contact Information</h2>
                <p className="mb-6 text-lg text-secondary/70">
                  You can also reach us using the following contact details:
                </p>
                
                <motion.div 
                  className="space-y-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="flex items-start space-x-4" variants={item}>
                    <motion.div 
                      className="w-12 h-12 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(18, 78, 102, 0.2)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-lg">Address</h3>
                      <p className="text-secondary/70">
                        <a 
                          href="https://maps.app.goo.gl/epfPhGCuVzjJif9i9" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[hsl(var(--primary))] transition-colors"
                        >
                          Karhal Rd, Gopi Nath Nagar,<br />
                          Agrawal Mohalla, Mainpuri,<br />
                          Uttar Pradesh 205001
                        </a>
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div className="flex items-start space-x-4" variants={item}>
                    <motion.div 
                      className="w-12 h-12 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(18, 78, 102, 0.2)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-lg">Phone</h3>
                      <p className="text-secondary/70">
                        <a href="tel:+919412308386" className="hover:text-[hsl(var(--primary))] transition-colors block">
                          +91 9412308386
                        </a>
                        <a href="tel:+919411936936" className="hover:text-[hsl(var(--primary))] transition-colors block mt-1">
                          +91 9411936936
                        </a>
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div className="flex items-start space-x-4" variants={item}>
                    <motion.div 
                      className="w-12 h-12 bg-[hsl(var(--primary)/0.1)] rounded-full flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(18, 78, 102, 0.2)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <p className="text-secondary/70">
                        <a href="mailto:info@modernweddingband.com" className="hover:text-[hsl(var(--primary))] transition-colors">
                          info@modernweddingband.com
                        </a>
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="mt-8 p-6 bg-[hsl(var(--muted))] rounded-lg hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                >
                  <h3 className="font-bold text-xl mb-4">Business Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>8:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday:</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday:</span>
                      <span>9:00 AM - 8:00 PM</span>
                    </li>
                  </ul>
                </motion.div>
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