import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that need authentication
const protectedRoutes = ['/admin', '/employee'];

export function middleware(request: NextRequest) {
  // Get pathname
  const { pathname } = request.nextUrl;
  
  // Security headers for all responses
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add CSP header in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
    );
  }
  
  return response;
} 