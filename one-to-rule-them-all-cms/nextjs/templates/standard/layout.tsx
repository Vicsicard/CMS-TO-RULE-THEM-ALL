import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  siteData?: any;
}

const StandardLayout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Personal Website', 
  description = 'My personal website showcasing my work and thoughts', 
  siteData 
}) => {
  const router = useRouter();
  const siteName = siteData?.site?.title || 'Personal Website';
  
  // Navigation links - these correspond to our 6 page structure
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/social', label: 'Social' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Head>
        <title>{title} | {siteName}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={`${title} | ${siteName}`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`} />
      </Head>

      {/* Header/Navigation */}
      <header className="py-4 bg-white shadow-sm dark:bg-gray-800 sticky top-0 z-10">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {siteName}
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-base font-medium transition duration-300 ${
                  router.pathname === link.href 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" strokeLinecap="round" 
                strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Site Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {siteName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {siteData?.site?.description || 'A personal website showcasing my work and journey.'}
              </p>
            </div>
            
            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Column 3: Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Email: {siteData?.site?.email || 'contact@example.com'}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StandardLayout;
