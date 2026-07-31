'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
  videoUrl?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  videoUrl = '/videos/Sg_mobile.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="accueil" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Background Video (Local) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isMounted && (
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover scale-100 filter brightness-100 contrast-105"
          >
            <source src={videoUrl || '/videos/Sg_mobile.mp4'} type="video/mp4" />
          </video>
        )}
        
        {/* Subtle Bottom Transition Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
      </div>

      {/* Floating Sound Toggle Control (Responsive mobile positioning) */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-20">
        <button
          onClick={toggleSound}
          className="inline-flex items-center gap-2 sm:gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-brand-dark/85 hover:bg-brand-dark backdrop-blur-xl border border-brand-gold/40 text-brand-gold hover:text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-[11px] sm:text-xs font-bold uppercase tracking-wider"
          aria-label={isMuted ? 'Activer le son de la vidéo' : 'Désactiver le son'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Activer le son</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              <span>Désactiver le son</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
