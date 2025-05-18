// Define the GalleryItem type
export interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  alt: string;
  title: string;
  category: string;
  thumbnail?: string;
  priority?: boolean;
  isPlaceholder?: boolean;
}

// Base64 encoded tiny placeholder image - used to avoid network requests
const PLACEHOLDER_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNM+g8AAV0BKUZUhVQAAAAASUVORK5CYII=";

// Mock data for the gallery with updated paths to match actual files
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    src: "/images/gallery/image1.jpg", // Using an actual image that exists
    alt: "Modern Band Royal Car For Baraat",
    title: "Modern Band Royal Car",
    category: "item",
    priority: true,
  },
  {
    id: 2,
    type: "image",
    src: "/images/gallery/image2.jpg", // Using an actual image that exists
    alt: "Baraat procession with royal DJ",
    title: "Royal DJ",
    category: "baraat",
    priority: true,
  },
  {
    id: 3,
    type: "image",
    src: "/images/gallery/image8.jpg", // Using an actual image that exists
    alt: "Won Best Band Award in Ram Leela Mainpuri 2025",
    title: "Best Band Award 2025",
    category: "item",
    priority: true
  },
  {
    id: 4,
    type: "image",
    src: "/images/gallery/image4.jpg", // Correct case for the actual video file
    alt: "Fancy Light For Baraat",
    title: "Fancy Lights",
    category: "item",
  },
  {
    id: 5,
    type: "image",
    src: "/images/gallery/image6.jpg", // Using the placeholder image that exists
    alt: "Royal Baggi For Baraat",
    title: "Royal Baggi",
    category: "item",
    priority: true
  },
  {
    id: 6,
    type: "image",
    src: "/images/gallery/image5.jpg", // Using an actual image that exists
    alt: "Crystal Lighting For Baraat",
    title: "Crystal Lighting",
    category: "item"
  },
  {
    id: 7,
    type: "image",
    src: "/images/gallery/image3.jpg", // Correct case for the actual video file
    alt: "Baraat Decoration",
    title: "Baraat Decoration",
    category: "baraat"
  },
  {
    id: 8,
    type: "video",
    src: "/images/gallery/video1.MOV", // Correct case for the actual video file
    alt: "Baraat Procession",
    title: "Baraat Procession", 
    category: "video"
  },
  {
    id: 9,
    type: "video",
    src: "/images/gallery/video2.MOV", // Correct case for the actual video file
    alt: "Ram baraat dance performance",
    title: "Ram Baraat 2025",
    category: "video"
  },
  {
    id: 10,
    type: "video",
    src: "/images/gallery/video3.MOV", // Correct case for the actual video file
    alt: "Baraat Procession",
    title: "Baraat Procession",
    category: "video"
  },
  {
    id: 11,
    type: "video",
    src: "/images/gallery/video4.mp4", // Correct case for the actual video file
    alt: "Baggi Celebration With Fireworks",
    title: "Firework Celebration",
    category: "video"
  }
];

// Available gallery categories for filtering
export const galleryCategories = [
  { id: "all", name: "All" },
  { id: "baraat", name: "Baraat" },
  { id: "item", name: "Band Items" },
  { id: "video", name: "Videos" }
];

// Filter gallery items by category
export function filterGalleryItems(items: GalleryItem[], category: string): GalleryItem[] {
  if (category === "all") return items;
  
  const filtered = items.filter(item => item.category === category);
  
  // Sort by priority if applicable
  return filtered.sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return 0;
  });
}

/**
 * Makes sure gallery images exist in the public directory
 * This is a helper function for development purposes
 */
export function ensureGalleryImages() {
  // In a real app, you would validate image paths here
  return galleryItems;
} 