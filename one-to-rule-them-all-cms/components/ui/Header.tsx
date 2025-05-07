'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface HeaderProps {
  siteData: {
    site: {
      title: string;
      subtitle?: string;
      logo?: any;
      headerImage?: any;
    };
  };
}

const Header: React.FC<HeaderProps> = ({ siteData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const { site } = siteData || { site: { title: 'Self Cast Studios' } };
  
  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/social', label: 'Social' },
    { href: '/contact', label: 'Contact' }
  ];

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`w-full ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'} fixed top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          {site.logo?.url ? (
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image 
                src={site.logo.url} 
                alt={site.title || "Site Logo"} 
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-selfcast-primary to-selfcast-accent rounded-full flex items-center justify-center text-white font-bold">
              {(site.title?.[0] || 'S').toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-xl font-heading font-bold text-selfcast-dark">{site.title || 'Self Cast Studios'}</span>
            {site.subtitle && (
              <span className="hidden md:block text-sm text-gray-600">{site.subtitle}</span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-medium transition-colors hover:text-selfcast-primary ${
                router.pathname === link.href
                  ? 'text-selfcast-primary'
                  : 'text-selfcast-dark'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-selfcast-dark focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2 font-medium transition-colors hover:text-selfcast-primary ${
                    router.pathname === link.href
                      ? 'text-selfcast-primary'
                      : 'text-selfcast-dark'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Spacer - ensures content doesn't hide under fixed header */}
      <div className="h-16 md:h-20"></div>
    </header>
  );
};

export default Header;
