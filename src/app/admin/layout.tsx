"use client";

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LucideIcon, Menu, X, User, LogOut, LayoutDashboard, Calendar, Users, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  // Admin navigation items
  const sidebarItems: SidebarItem[] = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { title: 'Bookings', icon: Calendar, href: '/admin/bookings' },
    { title: 'Employees', icon: Users, href: '/admin/employees' },
    { title: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/admin') {
      setIsLoading(false);
      return;
    }

    // Check if user is authenticated
    const checkAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        router.push('/admin');
        return;
      }

      try {
        const parsedToken = JSON.parse(adminToken);
        if (parsedToken.isAdmin) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin');
        }
      } catch (e) {
        localStorage.removeItem('adminToken');
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  // On login page, don't use the admin layout
  if (pathname === '/admin') {
    return (
      <>
        {/* Admin access point banner */}
        <div className="bg-gray-900 text-white py-3 px-4 text-center text-sm font-medium">
          <a href="/" className="underline hover:text-blue-300 transition-colors">
            ← Return to Wedding Band Website
          </a>
          <span className="mx-3">|</span>
          <span>Admin Access Only</span>
        </div>
        {children}
      </>
    );
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <>
        {/* Admin access point banner */}
        <div className="bg-gray-900 text-white py-3 px-4 text-center text-sm font-medium">
          <a href="/" className="underline hover:text-blue-300 transition-colors">
            ← Return to Wedding Band Website
          </a>
          <span className="mx-3">|</span>
          <span>Admin Access Only</span>
        </div>
        <div className="h-screen flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  // If not authenticated, don't render anything (redirect handled by useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin access point banner */}
      <div className="bg-gray-900 text-white py-3 px-4 text-center text-sm font-medium fixed w-full z-50">
        <a href="/" className="underline hover:text-blue-300 transition-colors">
          ← Return to Wedding Band Website
        </a>
        <span className="mx-3">|</span>
        <span>Admin Console - Logged in as {localStorage.getItem('adminToken') ? 
          JSON.parse(localStorage.getItem('adminToken')!).username : 'Admin'}</span>
      </div>
      
      {/* Sidebar - adjusted for banner height */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transition-transform transform bg-gray-800 border-r border-gray-700 pt-12",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Admin Console</h2>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <div className="bg-gray-900 p-2 rounded-full">
              <User className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {localStorage.getItem('adminToken') ? 
                  JSON.parse(localStorage.getItem('adminToken')!).username : 'Admin'}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-md group",
                  pathname === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 flex-shrink-0", 
                  pathname === item.href ? "text-blue-500" : "text-gray-400 group-hover:text-gray-300")} 
                />
                {item.title}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-md mt-auto"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-300" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content - adjusted for banner height */}
      <main className={cn(
        "transition-all duration-300 pt-12",
        "lg:ml-64" // Large screens: always offset content
      )}>
        {/* Mobile menu button - integrated with content flow */}
        <div className="lg:hidden absolute right-4 top-[78px] z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white shadow-md"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
} 