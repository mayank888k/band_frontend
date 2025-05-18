"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { galleryItems, GalleryItem, galleryCategories } from "@/lib/gallery";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { isPlaceholderImage } from "@/lib/image-optimization";

// Define a fixed placeholder base64 string to avoid network requests
const PLACEHOLDER_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNM+g8AAV0BKUZUhVQAAAAASUVORK5CYII=";

// Helper function to get YouTube thumbnail from YouTube URL
const getYouTubeThumbnail = (url: string) => {
  // Extract the YouTube video ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;

  // Return YouTube thumbnail URL if we have a video ID
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

// Helper function to check if a URL is a YouTube URL
const isYouTubeUrl = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to check if a URL is a Vimeo URL
const isVimeoUrl = (url: string) => {
  return url.includes('vimeo.com');
};

export default function GalleryContent() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [visibleItems, setVisibleItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement>>({});
  
  // Filter items based on category - memoize this calculation
  const filteredItems = useCallback(() => {
    return activeFilter === "all" 
      ? galleryItems 
      : galleryItems.filter(item => item.category === activeFilter);
  }, [activeFilter]);
  
  // Handle filter change
  const handleFilterChange = (category: string) => {
    if (category === activeFilter) return; // No need to reload if the same category
    setLoading(true);
    setVisibleItems([]); // Clear current items immediately
    setActiveFilter(category);
  };
  
  // Load items in chunks for better performance
  useEffect(() => {
    const items = filteredItems();
    let mounted = true;
    
    // Handle immediate loading for small datasets
    if (items.length <= 4) {
      const timer = setTimeout(() => {
        if (mounted) {
          setVisibleItems(items);
          setLoading(false);
        }
      }, 50); // Faster initial load
      
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    } 
    
    // For larger datasets, load in chunks
    const initialItems = items.slice(0, 4);
    
    // Load first batch quickly
    const firstBatchTimer = setTimeout(() => {
      if (mounted) {
        setVisibleItems(initialItems);
        setLoading(false);
      }
    }, 50);
    
    // Load the rest after a short delay
    const secondBatchTimer = setTimeout(() => {
      if (mounted) {
        setVisibleItems(items);
      }
    }, 250); // Reduced from 300 to 250ms for faster loading
    
    // Cleanup function
    return () => {
      mounted = false;
      clearTimeout(firstBatchTimer);
      clearTimeout(secondBatchTimer);
    };
  }, [activeFilter, filteredItems]);

  // Function to capture thumbnail from video element
  const captureVideoThumbnail = useCallback((video: HTMLVideoElement, itemId: number) => {
    const canvas = document.createElement('canvas');
    // Preserve the original video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      setVideoThumbnails(prev => ({ ...prev, [itemId]: thumbnailUrl }));
    }
  }, []);

  // Set up video thumbnail generation
  useEffect(() => {
    // Find items that need thumbnails generated
    const videoItems = visibleItems.filter(item => 
      item.type === 'video' && 
      !item.thumbnail && 
      !isYouTubeUrl(item.src) &&
      !isVimeoUrl(item.src) && 
      !videoThumbnails[item.id]
    );

    // Generate thumbnails for YouTube videos
    const youtubeItems = visibleItems.filter(item => 
      item.type === 'video' && 
      !item.thumbnail && 
      isYouTubeUrl(item.src) && 
      !videoThumbnails[item.id]
    );

    youtubeItems.forEach(item => {
      const thumbnail = getYouTubeThumbnail(item.src);
      if (thumbnail) {
        setVideoThumbnails(prev => ({ ...prev, [item.id]: thumbnail }));
      }
    });

    // Clean up functions for video elements
    return () => {
      videoItems.forEach(item => {
        const video = videoRefs.current[item.id];
        if (video) {
          video.removeEventListener('loadeddata', () => {});
          video.src = '';
          delete videoRefs.current[item.id];
        }
      });
    };
  }, [visibleItems, captureVideoThumbnail]);
  
  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
    document.body.style.overflow = "hidden";
  };
  
  const closeLightbox = () => {
    setLightboxItem(null);
    document.body.style.overflow = "auto";
  };
  
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Replace broken image with a fallback
    const target = event.target as HTMLImageElement;
    
    // Prevent infinite loops - don't attempt to reload if already showing an error state
    if (target.dataset.errorHandled === "true") {
      return;
    }
    
    // Mark this image as having been error-handled
    target.dataset.errorHandled = "true";
    
    // Log error for debugging
    console.error(`Failed to load image: ${target.src}`);
    
    // Try to load a real image on your server first
    try {
      let newSrc = "/images/placeholder-image.jpg";
      
      // If that fails, fall back to base64
      target.onerror = () => {
        target.src = PLACEHOLDER_IMAGE_BASE64;
        target.onerror = null; // Prevent further errors
      };
      
      // Set source to the placeholder image
      target.src = newSrc;
    } catch (e) {
      // Final fallback to base64
      target.src = PLACEHOLDER_IMAGE_BASE64;
      target.onerror = null;
    }
  };
  
  const currentItems = filteredItems();
  
  // Handle keyboard events for the lightbox (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxItem) {
        closeLightbox();
      }
    };

    if (lightboxItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxItem]);
  
  return (
    <section className="section bg-white">
      <div className="container">
        {/* Filters */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {galleryCategories.map(category => (
            <button 
              key={category.id}
              onClick={() => handleFilterChange(category.id)} 
              className={`px-4 py-2 rounded-full ${activeFilter === category.id 
                ? "bg-[hsl(var(--primary))] text-white" 
                : "bg-[hsl(var(--muted))] text-secondary hover:bg-[hsl(var(--muted)/0.7)]"} 
                transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(currentItems.length > 0 ? Math.min(currentItems.length, 6) : 4)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow-md bg-white">
                <div className="bg-gray-200 animate-pulse h-64 w-full"></div>
                <div className="p-4">
                  <div className="bg-gray-200 animate-pulse h-6 w-3/4 mb-2"></div>
                  <div className="bg-gray-200 animate-pulse h-4 w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Gallery Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.length > 0 ? (
              <AnimatePresence mode="wait">
                {visibleItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layoutId={`gallery-item-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden rounded-lg shadow-md cursor-pointer bg-white"
                    onClick={() => openLightbox(item)}
                  >
                    {item.type === "image" ? (
                      <div className="relative h-64 w-full bg-[hsl(var(--muted))]">
                        {item.isPlaceholder ? (
                          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-secondary/70">
                            <p>{item.alt}</p>
                          </div>
                        ) : (
                          <Image 
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority={item.priority}
                            onError={handleImageError}
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="relative h-64 w-full bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden">
                        {/* For videos, show auto-generated thumbnail or extract from source */}
                        {item.thumbnail ? (
                          // If thumbnail is provided, use it
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center">
                              <Image 
                                src={item.thumbnail} 
                                alt={`Thumbnail for ${item.title}`}
                                width={400}
                                height={225}
                                className="object-contain max-h-full"
                                loading="lazy"
                                onError={handleImageError}
                              />
                            </div>
                          </div>
                        ) : videoThumbnails[item.id] ? (
                          // If we've generated a thumbnail, use it
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center">
                              <Image 
                                src={videoThumbnails[item.id]}
                                alt={`Thumbnail for ${item.title}`}
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="max-h-[100%] max-w-[100%] w-auto h-auto object-contain"
                                style={{ objectFit: 'contain' }}
                                loading="lazy"
                                onError={handleImageError}
                              />
                            </div>
                          </div>
                        ) : isYouTubeUrl(item.src) ? (
                          // If it's a YouTube video, try to load a thumbnail
                          <>
                            {getYouTubeThumbnail(item.src) && (
                              <div className="h-full w-full flex items-center justify-center">
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image 
                                    src={getYouTubeThumbnail(item.src) || PLACEHOLDER_IMAGE_BASE64}
                                    alt={`Thumbnail for ${item.title}`}
                                    width={400}
                                    height={225}
                                    className="max-h-[100%] max-w-[100%] w-auto h-auto object-contain"
                                    loading="lazy"
                                    onError={handleImageError}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ) : !item.isPlaceholder && !isVimeoUrl(item.src) ? (
                          // For local videos, try to generate a thumbnail
                          <div className="absolute inset-0 opacity-0">
                            <video 
                              ref={(el) => {
                                if (el) {
                                  videoRefs.current[item.id] = el;
                                  el.addEventListener('loadeddata', () => captureVideoThumbnail(el, item.id));
                                  // Only load the metadata to generate thumbnail
                                  el.preload = "metadata";
                                  el.src = item.src;
                                  el.currentTime = 1; // Skip to 1 second to avoid black frames
                                }
                              }}
                              muted
                            />
                          </div>
                        ) : (
                          // Default placeholder
                          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-secondary/70 bg-gray-900/10">
                            <p className="text-sm mb-2">{item.title}</p>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-[hsl(var(--primary))/0.8] flex items-center justify-center text-white hover:bg-[hsl(var(--primary))] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-secondary/70">{item.alt}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-3 py-12 text-center">
                <p className="text-xl text-gray-500">No items found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Lightbox */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto" onClick={closeLightbox}>
          <div className="relative max-w-5xl w-full my-8" onClick={e => e.stopPropagation()}>
            
            {lightboxItem.type === "image" ? (
              <div className="rounded-lg overflow-hidden bg-[hsl(var(--muted))] flex items-center justify-center relative">
                <div className="absolute top-2 right-2 z-[60]">
                  <button 
                    onClick={closeLightbox} 
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 shadow-lg"
                    aria-label="Close lightbox"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {lightboxItem.isPlaceholder ? (
                  <div className="flex items-center justify-center p-8 text-center text-white/80">
                    <p className="text-xl">{lightboxItem.alt}</p>
                  </div>
                ) : (
                  <div className="relative h-[70vh] max-h-[70vh] w-auto flex items-center justify-center p-10">
                    <Image 
                      src={lightboxItem.src}
                      alt={lightboxItem.alt}
                      width={1200}
                      height={800}
                      className="object-contain max-h-[70vh] max-w-full"
                      priority
                      onError={handleImageError}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-black rounded-lg overflow-hidden relative">
                <div className="absolute top-2 right-2 z-[60]">
                  <button 
                    onClick={closeLightbox} 
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 shadow-lg"
                    aria-label="Close video"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="aspect-video mt-14">
                  {isYouTubeUrl(lightboxItem.src) || isVimeoUrl(lightboxItem.src) ? (
                    <iframe
                      className="w-full h-full"
                      src={lightboxItem.src.includes('youtube.com') 
                        ? `${lightboxItem.src}${lightboxItem.src.includes('?') ? '&' : '?'}autoplay=1` 
                        : lightboxItem.src}
                      title={lightboxItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      className="w-full h-full"
                      src={lightboxItem.src}
                      title={lightboxItem.title}
                      controls
                      autoPlay
                      playsInline
                    />
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 bg-white p-4 rounded-lg">
              <h3 className="font-bold text-xl">{lightboxItem.title}</h3>
              <p className="text-secondary/70">{lightboxItem.alt}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 