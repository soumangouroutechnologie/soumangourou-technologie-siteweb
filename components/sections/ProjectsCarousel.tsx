'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ProjectItem } from '@/lib/types';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectsCarouselProps {
  projects: ProjectItem[];
}

export const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay timer
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section id="projets" className="py-16 sm:py-24 bg-brand-beigeLight relative overflow-hidden text-zinc-900">
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-bronze/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-bronze" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-brand-bronze">
                NOS PROJETS →
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Des solutions créées pour impacter
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={scrollPrev}
              className="p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-brand-gold hover:border-brand-gold shadow-sm transition-all duration-300 active:scale-95"
              aria-label="Projet précédent"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:text-brand-gold hover:border-brand-gold shadow-sm transition-all duration-300 active:scale-95"
              aria-label="Projet suivant"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing py-2 sm:py-4" ref={emblaRef}>
          <div className="flex -ml-4 sm:-ml-6">
            {projects.map((project, idx) => (
              <div
                key={project.id || idx}
                className="flex-[0_0_88%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 sm:pl-6 min-w-0"
              >
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col justify-between rounded-2xl bg-white/80 backdrop-blur-md border border-zinc-200/80 p-4 sm:p-5 shadow-lg hover:shadow-xl hover:border-brand-gold/40 transition-all group"
                >
                  <div>
                    {/* Project Image Container */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 sm:mb-5 bg-zinc-100 shadow-inner">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Project Category Tag */}
                    {project.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-bronze bg-brand-bronze/10 px-2.5 py-1 rounded-md mb-2 inline-block">
                        {project.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 group-hover:text-brand-bronze transition-colors mb-2">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-zinc-600 line-clamp-3 leading-relaxed mb-4">
                      {project.summary}
                    </p>

                    {/* Technologies Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5 sm:mb-6">
                      {project.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] sm:text-[11px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visit / Detail Button */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <a
                      href={project.liveUrl || `#project-${project.slug}`}
                      target={project.liveUrl ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-bronze hover:text-brand-gold transition-colors"
                    >
                      <span>Découvrir</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center space-x-2 mt-6 sm:mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'w-7 sm:w-8 bg-brand-bronze'
                  : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="#projets"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-bronze hover:text-brand-gold bg-white border border-brand-bronze/30 shadow-md hover:shadow-lg transition-all"
          >
            Voir tous nos projets
          </Link>
        </div>
      </div>
    </section>
  );
};
