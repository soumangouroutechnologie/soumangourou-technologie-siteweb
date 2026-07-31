import React from 'react';

export const AfricanMaskIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5BF47" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6D2D" />
        </linearGradient>
      </defs>
      {/* Crown / Top Headdress Points */}
      <path d="M50 5 L60 22 L50 18 L40 22 Z" fill="url(#goldGradient)" />
      <path d="M35 12 L42 26 L34 24 L28 20 Z" fill="url(#goldGradient)" />
      <path d="M65 12 L72 20 L66 24 L58 26 Z" fill="url(#goldGradient)" />
      
      {/* Mask Head Shape */}
      <path
        d="M50 18 C30 18 25 35 25 55 C25 78 40 95 50 95 C60 95 75 78 75 55 C75 35 70 18 50 18 Z"
        fill="url(#goldGradient)"
        opacity="0.95"
      />
      
      {/* Facial Features (Eyes, Nose, Cheeks) */}
      {/* Eyes Slits */}
      <ellipse cx="38" cy="48" rx="7" ry="3" fill="#0B0B0C" />
      <ellipse cx="62" cy="48" rx="7" ry="3" fill="#0B0B0C" />
      <circle cx="38" cy="48" r="1.5" fill="#FAF8F5" />
      <circle cx="62" cy="48" r="1.5" fill="#FAF8F5" />
      
      {/* Elongated Nose */}
      <path d="M50 35 L46 65 L54 65 Z" fill="#6A511F" />
      
      {/* Tribal Cheek Markings */}
      <line x1="30" y1="58" x2="42" y2="60" stroke="#0B0B0C" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="64" x2="42" y2="66" stroke="#0B0B0C" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="58" x2="58" y2="60" stroke="#0B0B0C" strokeWidth="2" strokeLinecap="round" />
      <line x1="70" y1="64" x2="58" y2="66" stroke="#0B0B0C" strokeWidth="2" strokeLinecap="round" />

      {/* Mouth */}
      <rect x="44" y="74" width="12" height="4" rx="2" fill="#0B0B0C" />
    </svg>
  );
};

export const Logo: React.FC<{ variant?: 'light' | 'dark'; className?: string }> = ({
  variant = 'dark',
  className = '',
}) => {
  const textMain = variant === 'light' ? 'text-brand-beigeLight' : 'text-zinc-900 dark:text-brand-beigeLight';
  const textSub = variant === 'light' ? 'text-brand-gold' : 'text-brand-bronze dark:text-brand-gold';

  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative p-1.5 rounded-xl bg-brand-dark/10 dark:bg-brand-gold/10 border border-brand-gold/30 shadow-md group-hover:scale-105 transition-transform duration-300">
        <AfricanMaskIcon className="w-9 h-9 sm:w-10 sm:h-10" />
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-wider text-base sm:text-lg leading-tight uppercase ${textMain}`}>
          SOUMANGOUROU
        </span>
        <span className={`font-semibold tracking-[0.25em] text-[10px] sm:text-xs leading-tight uppercase ${textSub}`}>
          TECHNOLOGIE
        </span>
      </div>
    </div>
  );
};
