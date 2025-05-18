"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { getResponsiveImageSizes, shouldImageHavePriority, getImageQuality } from "@/lib/image-optimization";

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fadeIn?: boolean;
  lowQualitySrc?: string;
  isAboveFold?: boolean;
  isHeroImage?: boolean;
  isHighQuality?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * OptimizedImage enhances Next.js Image component with:
 * - Fade-in animation on load
 * - LQIP (Low Quality Image Placeholder) support
 * - Automatic priority for above-the-fold images
 * - Best-practice loading strategy
 * - Responsive image sizing
 * - Appropriate quality settings
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fadeIn = true,
  lowQualitySrc,
  priority,
  isAboveFold = false,
  isHeroImage = false,
  isHighQuality = false,
  sizes,
  quality,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Fixed placeholder for error states
  const PLACEHOLDER_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNM+g8AAV0BKUZUhVQAAAAASUVORK5CYII=";

  // Detect if image is in viewport for auto-priority
  useEffect(() => {
    // Skip for images already marked with priority
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`image-${alt?.replace(/\s+/g, '-')}`);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.disconnect();
    };
  }, [alt, priority]);

  // Auto-set priority based on our utility and visibility
  const calculatedPriority = shouldImageHavePriority(isAboveFold, isHeroImage);
  const shouldPrioritize = priority || calculatedPriority || isVisible;

  // Calculate appropriate image quality
  const imageQuality = quality || getImageQuality(isHighQuality);

  // Set responsive image sizes if not provided
  const responsiveSizes = sizes || getResponsiveImageSizes(props.fill ? 100 : 33);
  
  // Custom error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Call external error handler if provided
    if (onError) {
      onError(e);
    }
    
    // Prevent infinite loops - don't attempt to reload if already showing an error state
    const target = e.target as HTMLImageElement;
    if (target.dataset.errorHandled === "true") {
      return;
    }
    
    // Mark this image as having been error-handled
    target.dataset.errorHandled = "true";
    setImgError(true);
    
    // Use base64 placeholder directly to avoid any network requests
    target.src = PLACEHOLDER_IMAGE_BASE64;
  };

  return (
    <div className="relative overflow-hidden" id={`image-${alt?.replace(/\s+/g, '-')}`}>
      {/* Low quality placeholder */}
      {fadeIn && lowQualitySrc && !isLoaded && !imgError && (
        <Image
          src={lowQualitySrc}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover blur-md scale-105",
            className
          )}
          fill={props.fill}
          width={!props.fill ? props.width : undefined}
          height={!props.fill ? props.height : undefined}
        />
      )}

      {/* Main image */}
      <Image
        src={imgError ? PLACEHOLDER_IMAGE_BASE64 : src}
        alt={alt}
        className={cn(
          fadeIn ? "transition-opacity duration-500" : "",
          !isLoaded && fadeIn ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        priority={shouldPrioritize}
        loading={shouldPrioritize ? "eager" : "lazy"}
        quality={imageQuality}
        sizes={responsiveSizes}
        data-error-handled="false"
        {...props}
      />
    </div>
  );
} 