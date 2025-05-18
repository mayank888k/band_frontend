import dynamic from 'next/dynamic';
import * as React from 'react';

/**
 * Dynamic import configuration for heavy components
 * This helps reduce initial page load size by lazy-loading non-critical components
 */

/**
 * Dynamic import configuration for framer-motion components
 * This helps reduce initial page load size by lazy-loading non-critical animations
 */

// Dynamic import for framer-motion animations - reduces initial bundle size
export const motion = {
  div: dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
    ssr: false,
    loading: () => React.createElement('div', { style: { height: "inherit", width: "inherit" } })
  }),
  section: dynamic(() => import('framer-motion').then((mod) => mod.motion.section), {
    ssr: false,
    loading: () => React.createElement('section', { style: { height: "inherit", width: "inherit" } })
  }),
  h1: dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), {
    ssr: false,
    loading: () => React.createElement('h1', { style: { visibility: "hidden" } })
  }),
  h2: dynamic(() => import('framer-motion').then((mod) => mod.motion.h2), {
    ssr: false,
    loading: () => React.createElement('h2', { style: { visibility: "hidden" } })
  }),
  p: dynamic(() => import('framer-motion').then((mod) => mod.motion.p), {
    ssr: false,
    loading: () => React.createElement('p', { style: { visibility: "hidden" } })
  }),
  nav: dynamic(() => import('framer-motion').then((mod) => mod.motion.nav), {
    ssr: false,
    loading: () => React.createElement('nav', { style: { height: "inherit", width: "inherit" } })
  }),
};

// Dynamic import for existing heavy components
export const DynamicFooter = dynamic(() => import('@/components/Footer'), {
  ssr: true
});

export const DynamicGalleryContent = dynamic(() => import('@/components/gallery/GalleryContent'), {
  ssr: false // Load client-side only to improve initial page load
});

export const DynamicServiceCard = dynamic(() => import('@/components/ServiceCard'), {
  ssr: false
});

// Import the named export for CheckBooking
export const DynamicCheckBooking = dynamic(
  () => import('@/components/CheckBooking').then(mod => ({ default: mod.CheckBooking })),
  { ssr: false }
);

// Note: Add these back once these components are created
/*
export const DynamicGallery = dynamic(() => import('@/components/Gallery'), {
  ssr: false // Load client-side only to improve initial page load
});

export const DynamicTestimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: false
});
*/ 