'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPostItem } from '@/lib/types';
import { Search, Clock, Calendar, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogSectionProps {
  posts: BlogPostItem[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || post.category?.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = Array.from(
    new Set(posts.map((p) => p.category?.name).filter(Boolean))
  );

  return (
    <section id="blog" className="py-24 bg-brand-beigeLight text-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-bronze" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-bronze">
                NOTRE BLOG & ACTUALITÉS
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Réflexions & Analyses Technologiques
            </h2>
          </div>

          {/* Search Input */}
          <div className="mt-6 md:mt-0 relative w-full md:w-72">
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-zinc-300 focus:outline-none focus:border-brand-bronze shadow-sm text-sm"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-brand-bronze text-white shadow-md'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Tous les articles
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat?.toLowerCase() || '')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat?.toLowerCase()
                  ? 'bg-brand-bronze text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-white border border-zinc-200/80 overflow-hidden shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-100">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-md text-brand-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-gold/30">
                      {post.category.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta info */}
                  <div className="flex items-center space-x-4 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-bronze" />
                      {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-bronze" />
                      {post.readingTime} min de lecture
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-zinc-900 hover:text-brand-bronze transition-colors line-clamp-2 mb-3">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-bronze/20 text-brand-bronze font-bold text-xs flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-zinc-700">{post.authorName}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-bronze hover:text-brand-gold"
                >
                  <span>Lire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
