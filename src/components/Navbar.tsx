"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { CheckBooking } from "@/components/CheckBooking";
import { Button } from "@/components/ui/button";
import { usePrefetchRoute } from "@/lib/prefetch";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const prefetchRoute = usePrefetchRoute();

  // Memoize scroll handler to prevent unnecessary rerenders
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Set initial scroll state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Navigation links with prefetching
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/packages", label: "Packages" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/enquiry", label: "Price Enquiry" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <motion.nav
      initial={{ y: 0, opacity: 0.9 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 w-full z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled 
            ? "bg-white py-2 shadow-md"
            : "py-4 bg-gradient-to-b from-[#212A31]/80 to-transparent backdrop-blur-sm"
          : isScrolled 
            ? "navbar-fixed py-2" 
            : "navbar-transparent py-4 bg-gradient-to-b from-[#212A31]/10 to-[#212A31]/60 backdrop-blur-lg"
      }`}
      style={{ top: 'var(--promo-banner-height)' }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-display text-2xl font-bold flex items-center">
          <div>
            <span className={isHomePage && !isScrolled ? "text-[#748D92]" : "text-[hsl(var(--primary))]"}>Modern</span>
            <span className={isHomePage && !isScrolled ? "text-white" : isScrolled ? "text-[hsl(var(--secondary))]" : "text-white"}>Band</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((item) => (
            <li key={item.href} className="relative">
              <Link 
                href={item.href} 
                className={`relative overflow-hidden transition-colors group py-2 ${
                  isHomePage && !isScrolled
                    ? "text-white hover:text-white/80"
                    : isScrolled
                    ? `text-[#2E3944] hover:text-[#748D92] ${pathname === item.href ? "text-[#748D92]" : ""}`
                    : `hover:text-[hsl(var(--primary))] ${pathname === item.href ? "text-[hsl(var(--primary))]" : "text-white"}`
                }`}
                onMouseEnter={() => {
                  // Prefetch route on hover
                  if (item.href !== pathname) {
                    prefetchRoute(item.href);
                  }
                }}
              >
                {item.label}
                <span className={`absolute bottom-[-0px] left-0 h-[2px] transition-all duration-300 ${
                  isHomePage && !isScrolled
                    ? "bg-white"
                    : "bg-[hsl(var(--primary))]"
                } ${
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/booking')}
            onMouseEnter={() => prefetchRoute('/booking')}
            className={`${
              isHomePage && !isScrolled
                ? "bg-[#748D92] text-white hover:bg-[#748D92]/90"
                : "btn-primary"
            }`}
          >
            Book Now
          </Button>
          <CheckBooking
            className={`${
              isHomePage && !isScrolled
                ? "bg-[#748D92] text-white hover:bg-[#748D92]/90"
                : "btn-primary"
            }`}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 rounded-lg ${
            isHomePage && !isScrolled ? "text-white" : isScrolled ? "text-[#2E3944]" : "text-white"
          }`}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full left-0 right-0 ${
                isScrolled ? "bg-white shadow-lg" : "bg-[#212A31]/95 backdrop-blur-lg"
              }`}
            >
              <ul className="container mx-auto py-4">
                {navLinks.map((item) => (
                  <li key={item.href} className="py-2">
                    <Link 
                      href={item.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`block transition-colors ${
                        isScrolled
                          ? `text-[#2E3944] hover:text-[#748D92] ${pathname === item.href ? "text-[#748D92]" : ""}`
                          : `text-white hover:text-[#748D92] ${pathname === item.href ? "text-[#748D92]" : ""}`
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="py-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/booking");
                    }}
                    className={`${
                      isHomePage && !isScrolled
                        ? "bg-[#748D92] text-white hover:bg-[#748D92]/90"
                        : "btn-primary"
                    } w-full`}
                  >
                    Book Now
                  </Button>
                </li>
                <li className="py-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.querySelector('[aria-label="Check Booking"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                    className={`${
                      isHomePage && !isScrolled
                        ? "bg-[#748D92] text-white hover:bg-[#748D92]/90"
                        : "btn-primary"
                    } w-full`}
                  >
                    Check Booking
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 