'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Nos projets', href: '#projets' },
    { name: 'À propos', href: '#a-propos' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-dark/85 backdrop-blur-xl border-b border-brand-gold/15 py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-brand-dark/80 via-brand-dark/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Logo variant="light" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 bg-brand-dark/40 border border-brand-gold/20 backdrop-blur-md px-6 py-2 rounded-full shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-medium uppercase tracking-wider text-brand-beige/90 hover:text-brand-gold transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gold-gradient hover:bg-gold-gradient-hover shadow-lg hover:shadow-brand-gold/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Parlons de votre projet</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-brand-beige hover:text-brand-gold focus:outline-none bg-brand-dark/60 border border-brand-gold/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-brand-dark/95 backdrop-blur-2xl border-b border-brand-gold/20 px-6 py-6"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-wider font-semibold text-brand-beige hover:text-brand-gold py-2 border-b border-brand-gold/10"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gold-gradient shadow-lg"
              >
                <span>Parlons de votre projet</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
