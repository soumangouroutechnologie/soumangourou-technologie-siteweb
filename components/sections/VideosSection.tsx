'use client';

import React, { useState } from 'react';
import { YoutubeVideoItem } from '@/lib/types';
import { Play, Sparkles } from 'lucide-react';
import { YoutubeIcon } from '@/components/ui/SocialIcons';
import { motion } from 'framer-motion';

interface VideosSectionProps {
  videos: YoutubeVideoItem[];
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    videos.length > 0 ? videos[0].youtubeId : 'dQw4w9WgXcQ'
  );

  return (
    <section id="videos" className="py-24 bg-brand-dark relative text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              NOS VIDÉOS & MEDIA
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-beigeLight tracking-tight">
            Découvrez nos réalisations en image
          </h2>
          <p className="mt-3 text-base text-brand-beige/70">
            Visionnez nos démos, interviews et vidéos exclusives.
          </p>
        </div>

        {/* Featured Video Player */}
        <div className="max-w-4xl mx-auto mb-12 rounded-3xl overflow-hidden bg-brand-darkCard border border-brand-gold/25 shadow-2xl p-2 sm:p-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {/* Video Thumbnails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {videos.map((vid) => {
            const isCurrent = activeVideoId === vid.youtubeId;
            return (
              <motion.div
                key={vid.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveVideoId(vid.youtubeId)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-brand-gold/15 border-brand-gold shadow-lg shadow-brand-gold/10'
                    : 'bg-brand-darkCard/80 border-brand-gold/15 hover:border-brand-gold/40'
                }`}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-3 group">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/90 text-brand-dark flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <YoutubeIcon className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-semibold text-brand-beigeLight line-clamp-1">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="text-xs text-brand-beige/60 line-clamp-2 mt-1">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
