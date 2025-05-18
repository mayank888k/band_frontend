"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PublicPageWrapper from "@/components/PublicPageWrapper";

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Priya & Arjun",
      location: "Delhi",
      date: "December 2022",
      text: "Modern Band made our wedding day truly special. The baraat procession was filled with such energy and had everyone dancing. They were professional, punctual, and exceeded our expectations!",
      rating: 5,
    },
    {
      id: 2,
      name: "Vikram & Neha",
      location: "Mainpuri",
      date: "February 2023",
      text: "We booked the full-day package and it was worth every rupee. From the traditional morning ceremonies to the reception, the band created the perfect atmosphere. Our guests are still talking about it!",
      rating: 5,
    },
    {
      id: 3,
      name: "Meera & Raj",
      location: "Agra",
      date: "November 2022",
      text: "Modern Band traveled to our venue in Agra and made our sangeet night magical. The singers were exceptional and they accommodated all our song requests. Highly recommended!",
      rating: 5,
    },
    {
      id: 4,
      name: "Sunita & Karan",
      location: "Kanpur",
      date: "March 2023",
      text: "From our first meeting to the wedding day, Arvindra and his team were professional and attentive. The music selection was perfect and they adapted well to our schedule changes on the day.",
      rating: 5,
    },
    {
      id: 5,
      name: "Amit & Divya",
      location: "Lucknow",
      date: "January 2023",
      text: "If you want authentic UP style wedding music with modern touches, look no further! Modern Band brought so much life to our baraat and reception. They are true masters of their craft.",
      rating: 5,
    },
    {
      id: 6,
      name: "Ananya & Rohan",
      location: "Mainpuri",
      date: "April 2023",
      text: "As a local Mainpuri couple, we knew Modern Band's reputation, but they still surprised us with their creativity and energy. The dhol players were a highlight - everybody loved them!",
      rating: 5,
    },
  ];

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
                <span className="text-[#124E66]">Our</span> Testimonials
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
                Read what our happy clients say about their experience with Modern Band.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-white rounded-lg p-6 shadow-md border border-[hsl(var(--muted))] relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1, 
                    ease: [0.25, 0.1, 0.25, 1] 
                  }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[hsl(var(--primary))]">{testimonial.name}</h3>
                      <p className="text-sm text-secondary/60">{testimonial.location} • {testimonial.date}</p>
                    </div>
                    <div className="flex text-[hsl(var(--accent))]">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[hsl(var(--muted))] opacity-40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  <p className="text-secondary/70 mb-4">{testimonial.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Share Your Experience Section */}
        <section className="section bg-[hsl(var(--muted)/0.2)]">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="mb-6 text-3xl md:text-4xl">Share Your Experience</h2>
              <p className="text-lg mb-8 text-secondary/70">
                We'd love to hear about your experience with Modern Band. If you've recently hired us for your event, please consider sharing your feedback.
              </p>
              <Link href="/contact?subject=Testimonial" className="btn btn-lg btn-primary">
                Submit Your Testimonial
              </Link>
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
              <h2 className="mb-6 text-3xl md:text-4xl lg:text-5xl text-white">Ready to Make Your Event Special?</h2>
              <div className="w-24 h-1 bg-[#748D92] mx-auto mb-6"></div>
              <p className="text-xl mb-8 text-white/90">
                Join our happy clients by booking Modern Band for your upcoming celebration.
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