'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types';
import { Sparkles, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GallerySectionProps {
  galleries: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleries }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Flatten all images
  const allImages = galleries.flatMap((g) => g.images);

  return (
    <section id="galerie" className="py-24 bg-brand-beige relative text-zinc-900 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-bronze" />
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-bronze">
              GALERIE & PORTFOLIO
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Immersion dans notre univers
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {allImages.map((img, idx) => (
            <motion.div
              key={img.id || idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(img.imageUrl)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg group bg-zinc-200 border border-brand-gold/20"
            >
              <Image
                src={img.imageUrl}
                alt={img.title || 'Galerie image'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <Maximize2 className="w-8 h-8 text-brand-gold mb-2" />
                {img.title && <h4 className="text-white font-bold text-base">{img.title}</h4>}
                {img.caption && <p className="text-brand-beige/80 text-xs mt-1">{img.caption}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-brand-gold p-3 bg-white/10 rounded-full backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-5xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
              <Image src={selectedImage} alt="Enlarged view" fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
