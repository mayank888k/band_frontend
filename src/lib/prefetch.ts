import { useRouter } from "next/navigation";

/**
 * Prefetch multiple routes in batch
 * Helps improve navigation performance by preloading routes before they're needed
 */
export function prefetchRoutes(routes: string[]) {
  const router = useRouter();
  
  if (typeof window === 'undefined') return; // Only run on client
  
  // Use requestIdleCallback to prefetch during browser idle time
  // This ensures that prefetching doesn't compete with critical rendering
  const prefetchWithIdleCallback = () => {
    routes.forEach(route => {
      try {
        router.prefetch(route);
      } catch (e) {
        console.warn(`Failed to prefetch route: ${route}`, e);
      }
    });
  };

  // Use requestIdleCallback if available, otherwise setTimeout
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(prefetchWithIdleCallback, { timeout: 3000 });
  } else {
    setTimeout(prefetchWithIdleCallback, 1000);
  }
}

/**
 * Prefetch a specific route on demand
 * Useful for actions like hovering over links
 * Note: This must be used within a component that has access to the router context
 */
export function usePrefetchRoute() {
  const router = useRouter();
  
  return (route: string) => {
    if (typeof window === 'undefined') return; // Only run on client
    
    try {
      router.prefetch(route);
    } catch (e) {
      console.warn(`Failed to prefetch route: ${route}`, e);
    }
  };
} 