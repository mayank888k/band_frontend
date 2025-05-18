"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoBannerProps {
  messages: string[];
  speed?: number; // 1-10, with 10 being fastest
}

export default function PromoBanner({ 
  messages = [
    "Book now and get 10% off your wedding band package", 
    "Special discounts for 2024 wedding dates", 
    "Free consultation for all new inquiries"
  ], 
  speed = 5 
}: PromoBannerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Set up mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle message rotation for mobile view
  useEffect(() => {
    if (!isMobile || isPaused) return;
    
    // Rotate messages every few seconds on mobile
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 4000); // 4 seconds per message
    
    return () => clearInterval(interval);
  }, [isMobile, isPaused, messages.length]);
  
  // Convert speed (1-10) to duration (40s-10s)
  // Lower speed = longer duration = slower scrolling
  const duration = 45 - (speed * 3.5);
  
  return (
    <div 
      className="fixed top-0 left-0 w-full z-[60] bg-[#f2f2f2] overflow-hidden border-b border-gray-200 flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ height: 'var(--promo-banner-height)' }}
    >
      {/* Mobile view - single message with fade transition */}
      {isMobile && (
        <div className="w-full px-4 py-1.5 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs text-[#333] truncate"
            >
              {messages[currentMessageIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      
      {/* Desktop view - marquee effect */}
      {!isMobile && (
        <div className="marquee-container relative whitespace-nowrap">
          <div 
            className={`marquee-content inline-block ${isPaused ? 'pause-animation' : ''}`}
            style={{
              animation: `scrollText ${duration}s linear infinite`,
              paddingLeft: "100%", // Start from the right side off-screen
            }}
          >
            {messages.map((message, index) => (
              <span key={index} className="mx-8 text-sm font-medium">
                {message} <span className="mx-2 text-gray-400">•</span>
              </span>
            ))}
          </div>
          
          {/* Duplicate for seamless loop */}
          <div 
            className={`marquee-content inline-block ${isPaused ? 'pause-animation' : ''}`}
            style={{
              animation: `scrollText ${duration}s linear infinite`,
              animationDelay: `${duration / 2}s`,
              paddingLeft: "100%", // Start from the right side off-screen
            }}
          >
            {messages.map((message, index) => (
              <span key={index} className="mx-8 text-sm font-medium">
                {message} <span className="mx-2 text-gray-400">•</span>
              </span>
            ))}
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes scrollText {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .pause-animation {
          animation-play-state: paused !important;
        }
        
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
        }
        
        .marquee-content:last-child {
          position: absolute;
          top: 0;
        }
      `}</style>
    </div>
  );
} 