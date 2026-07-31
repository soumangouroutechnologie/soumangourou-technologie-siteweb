'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
  videoUrl?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  videoUrl = 'https://www.youtube.com/watch?v=gqCirSU7aT8',
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="accueil" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
      {/* Background Video (YouTube) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-brand-dark">
        {/* Pointer-events-none prevents clicking on the video */}
        {isMounted && (
          <div 
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none opacity-90"
            style={{ transform: 'translate(-50%, -50%) scale(1.3)' }}
          >
            <ReactPlayer
              url={videoUrl || 'https://www.youtube.com/watch?v=gqCirSU7aT8'}
              playing={true}
              muted={isMuted}
              loop={true}
              controls={false}
              width="100%"
              height="100%"
              config={({
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    controls: 0,
                    disablekb: 1,
                    playsinline: 1,
                  }
                }
              }) as any}
            />
          </div>
        )}
        
        {/* Transparent overlay to double-ensure no interaction */}
        <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
        
        {/* Subtle Bottom Transition Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-dark to-transparent z-10 pointer-events-none" />
      </div>

      {/* Floating Sound Toggle Control (Responsive mobile positioning) */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-20 pointer-events-auto">
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
