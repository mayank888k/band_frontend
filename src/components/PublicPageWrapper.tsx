"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrefetchRoute } from "@/lib/prefetch";

interface PublicPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for public pages that adds navbar, promo banner, and footer
 * This is an alternative to using the (public) route group with its own layout
 */
export default function PublicPageWrapper({ children }: PublicPageWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const prefetchRoute = usePrefetchRoute();

  // Prefetch common routes when user visits any page
  useEffect(() => {
    // Skip prefetching the current page
    const routesToPrefetch = [
      '/about',
      '/packages',
      '/booking',
      '/gallery',
      '/testimonials',
      '/contact'
    ].filter(route => route !== pathname);

    // Prefetch each route during browser idle time
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        routesToPrefetch.forEach(route => {
          prefetchRoute(route);
        });
      }, { timeout: 3000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        routesToPrefetch.forEach(route => {
          prefetchRoute(route);
        });
      }, 1000);
    }
  }, [pathname, prefetchRoute]);

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