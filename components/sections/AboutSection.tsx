'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Headphones, ShieldCheck, Cpu, Award, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  settings?: any;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const values = [
    {
      title: settings?.aboutValue1Title || 'Écoute & Conseil',
      description: settings?.aboutValue1Desc || 'Nous comprenons vos besoins pour vous proposer les meilleures solutions.',
      icon: Headphones,
    },
    {
      title: settings?.aboutValue2Title || 'Qualité & Performance',
      description: settings?.aboutValue2Desc || 'Nous développons des produits fiables, sécurisés et évolutifs.',
      icon: ShieldCheck,
    },
    {
      title: settings?.aboutValue3Title || 'Innovation',
      description: settings?.aboutValue3Desc || 'Nous intégrons les dernières technologies pour vous garder en avance.',
      icon: Cpu,
    },
    {
      title: settings?.aboutValue4Title || 'Engagement Africain',
      description: settings?.aboutValue4Desc || 'Nous valorisons notre culture et contribuons à l\'essor du numérique en Afrique.',
      icon: Award,
    },
  ];

  return (
    <section id="a-propos" className="py-24 bg-brand-beige relative overflow-hidden text-zinc-900 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: African King Sculpture Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-brand-gold/30">
              <Image
                src={settings?.aboutImageUrl || "/images/about-african-king.png"}
                alt="SOUMANGOUROU Patrimoine & Vision"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
            </div>

            {/* Floating Gold Emblem Badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-brand-gold/40 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center text-white font-bold text-xl">
                {settings?.aboutBadgeStat || "100%"}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-900">Excellence</p>
                <p className="text-[11px] text-zinc-600">Savoir-faire Africain</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content & 4 Values */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 w-max">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-bronze">
                {settings?.aboutBadge || "À PROPOS DE NOUS →"}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              {settings?.aboutTitle || "L'innovation au service du développement africain"}
            </h2>

            {/* Main Text */}
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              <strong className="font-semibold text-brand-bronze">SOUMANGOUROU TECHNOLOGIE</strong> {settings?.aboutMainText ? settings.aboutMainText.replace(/^(SOUMANGOUROU TECHNOLOGIE|SOUMANGOUROU TECHNOLOGIE est)\s*/i, 'est ') : "est une entreprise ivoirienne spécialisée dans la conception de solutions numériques modernes et accessibles."}
            </p>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {settings?.aboutSubText || "Notre mission est d'accompagner les entreprises, associations et entrepreneurs grâce à des outils performants, tout en valorisant notre identité et nos valeurs africaines."}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gold-gradient hover:bg-gold-gradient-hover shadow-lg hover:shadow-brand-gold/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>En savoir plus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-brand-gold/20">
              {values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div key={idx} className="flex items-start space-x-3.5 group">
                    <div className="p-2.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-bronze group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-brand-bronze transition-colors">
                        {val.title}
                      </h4>
                      <p className="text-xs text-zinc-600 leading-relaxed mt-1">
                        {val.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
