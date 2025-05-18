/**
 * Utility functions for optimizing images in Next.js
 */

export type ImageProps = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  priority?: boolean;
  className?: string;
};

/**
 * Returns image dimensions appropriate for different viewport sizes
 */
export function getResponsiveImageSizes(defaultSize: number = 100): string {
  return `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${defaultSize}vw`;
}

/**
 * Determines if an image should have priority loading
 * Use for critical above-the-fold images
 */
export function shouldImageHavePriority(
  isAboveFold: boolean,
  isHeroImage: boolean = false
): boolean {
  return isAboveFold || isHeroImage;
}

/**
 * Get appropriate quality settings for images
 */
export function getImageQuality(isHighQuality: boolean = false): number {
  return isHighQuality ? 85 : 75;
}

/**
 * Checks if the given source is a placeholder or base64 image
 * Used to determine if we should use unoptimized rendering
 */
export function isPlaceholderImage(src: string): boolean {
  return !src || src.startsWith('data:') || src.includes('placeholder');
} 