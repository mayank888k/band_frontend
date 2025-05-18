import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1e2530] text-white">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1 - Logo and Info */}
          <div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-[#4ECDC4]">Modern</span>
              <span className="text-white">Band</span>
            </h3>
            <p className="mb-6 text-white/80 text-sm">
              Professional wedding band services for all your special celebrations.
            </p>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-[#4ECDC4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-[#4ECDC4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-[#4ECDC4]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#4ECDC4] pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#4ECDC4] pb-2 inline-block">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/packages#baraat" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Baraat Band
                </Link>
              </li>
              <li>
                <Link href="/packages#reception" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Reception Performance
                </Link>
              </li>
              <li>
                <Link href="/packages#sangeet" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Sangeet Nights
                </Link>
              </li>
              <li>
                <Link href="/packages#full-day" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Full-Day Package
                </Link>
              </li>
              <li>
                <Link href="/packages#custom" className="text-white/80 hover:text-[#4ECDC4] text-sm transition-colors">
                  Custom Packages
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-[#4ECDC4] pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#4ECDC4] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/80 text-sm">
                  <a href="https://maps.app.goo.gl/kXuG6vE1CxEV8z5A8" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#4ECDC4] transition-colors inline-block">
                    Karhal Rd, Gopi Nath Nagar, Agrawal Mohalla, Mainpuri, Uttar Pradesh 205001
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#4ECDC4] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-white/80 text-sm">
                  <a href="tel:+919412308386" className="text-white/80 hover:text-[#4ECDC4] transition-colors block">
                    +91 9412308386
                  </a>
                  <a href="tel:+919411936936" className="text-white/80 hover:text-[#4ECDC4] transition-colors block mt-1">
                    +91 9411936936
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#4ECDC4] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white/80 text-sm">
                  info@modernweddingband.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#1a2026] py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © {currentYear} Modern Band. All rights reserved.
          </p>
          <div className="mt-2 md:mt-0 flex gap-8">
            <Link href="/privacy-policy" className="text-white/70 hover:text-[#4ECDC4] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-[#4ECDC4] text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 