import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import ClientAnimationProvider from "@/components/ClientAnimationProvider";

// Font optimizations - adjust display strategies
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Modern Band | Traditional & Modern Wedding Music",
  description: "Professional wedding band services for baraat, reception, and all wedding ceremonies in Mainpuri, Uttar Pradesh. Book the best wedding band for your special day.",
  keywords: "wedding band, traditional band, baraat services, wedding music, reception band, band in mainpuri, best wedding band in mainpuri, wedding band in mainpuri, wedding band in up, wedding band in uttar pradesh, wedding band in india, best wedding band in india, best wedding band in uttar pradesh, best wedding band in up, best wedding band in india, best wedding band in uttar pradesh, best wedding band in up, best wedding band in india, best wedding band in uttar pradesh, best wedding band in up, mainpuri",
  authors: [{ name: "Modern Band" }],
  creator: "Modern Band",
  publisher: "Modern Band",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#124E66" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground">
        <ClientAnimationProvider>
          {children}
        </ClientAnimationProvider>
      </body>
    </html>
  );
}
