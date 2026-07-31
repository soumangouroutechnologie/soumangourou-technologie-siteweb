'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { FacebookIcon, LinkedinIcon, InstagramIcon, YoutubeIcon, GithubIcon, TwitterXIcon } from '@/components/ui/SocialIcons';
import { Send, Check } from 'lucide-react';

interface FooterProps {
  settings?: any;
  socials?: any[];
}

export const Footer: React.FC<FooterProps> = ({ settings, socials }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const tagline = settings?.footerTagline || "Concepteur de solutions digitales d'excellence inspirées de l'héritage africain.";
  const copyright = settings?.copyrightText || "© 2026 SOUMANGOUROU TECHNOLOGIE. Tous droits réservés.";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  const defaultSocials = [
    { platform: 'Facebook', url: 'https://facebook.com', icon: FacebookIcon },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: LinkedinIcon },
    { platform: 'Instagram', url: 'https://instagram.com', icon: InstagramIcon },
    { platform: 'YouTube', url: 'https://youtube.com', icon: YoutubeIcon },
    { platform: 'GitHub', url: 'https://github.com', icon: GithubIcon },
    { platform: 'X', url: 'https://twitter.com', icon: TwitterXIcon },
  ];

  return (
    <footer className="bg-brand-dark text-brand-beige border-t border-brand-gold/15 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between pb-8 border-b border-brand-gold/10">
          {/* Logo & Slogan */}
          <div className="md:col-span-4 flex flex-col space-y-3">
            <Logo variant="light" />
            <p className="text-xs text-brand-beige/70">
              {tagline}
            </p>
          </div>

          {/* Social Icons */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-center space-x-3">
            {defaultSocials.map((s, idx) => {
              const IconComp = s.icon;
              return (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="p-2.5 rounded-full bg-brand-darkCard border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <IconComp className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
              Abonnez-vous à la newsletter
            </h4>
            {subscribed ? (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 py-2">
                <Check className="w-4 h-4" /> Merci pour votre inscription !
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Votre e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-full bg-brand-darkCard border border-brand-gold/20 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-gold-gradient text-white hover:bg-gold-gradient-hover transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright & Mentions */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-beige/60">
          <p>{copyright}</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-brand-gold transition-colors">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-brand-gold transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
