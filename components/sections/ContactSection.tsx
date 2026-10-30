'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Logo } from '@/components/ui/Logo';
import { MapPin, Mail, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SocialLinkItem } from '@/lib/types';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Veuillez entrer votre nom complet'),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(3, 'Veuillez préciser le sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  socials?: SocialLinkItem[];
  settings?: any;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const address = settings?.companyAddress || "Abidjan, Côte d'Ivoire";
  const email =
    !settings?.companyEmail || settings.companyEmail === 'contact@soumangourou.tech'
      ? 'info@soumangouroutechnologie.com'
      : settings.companyEmail;
  const phone =
    !settings?.companyPhone ||
    settings.companyPhone === '+225 07 08 09 10 11' ||
    settings.companyPhone === '+2250708091011'
      ? '+2250706045256'
      : settings.companyPhone;
  const mapEmbedUrl = settings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127108.64724773802!2d-4.049449830578613!3d5.348443905470125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8e34927f8a7e5%3A0x6b772413158f4a3e!2sAbidjan%2C%20C%C3%B4te%20d'Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message || 'Une erreur s\'est produite');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0B0B0C] text-white relative overflow-hidden border-t border-brand-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <Logo variant="light" />

            <p className="text-sm text-brand-beige/80 leading-relaxed">
              Transformons vos idées en solutions digitales puissantes et durables.
            </p>

            {/* Direct Contact Details */}
            <div className="flex flex-col space-y-4 pt-2">
              <div className="flex items-center gap-3 text-brand-beige/90">
                <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{address}</span>
              </div>

              <div className="flex items-center gap-3 text-brand-beige/90">
                <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${email}`} className="text-sm hover:text-brand-gold transition-colors">
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-3 text-brand-beige/90">
                <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm hover:text-brand-gold transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Center Form Column */}
          <div className="lg:col-span-5 bg-brand-darkCard/90 backdrop-blur-xl border border-brand-gold/25 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-brand-beigeLight mb-6">
              Parlons de votre projet
            </h3>

            {submitSuccess && (
              <div className="p-4 mb-6 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Votre message a été envoyé avec succès ! Nous vous recontacterons sous 24h.</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 mb-6 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    {...register('fullName')}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
                  />
                  {errors.fullName && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.fullName.message}</span>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Sujet"
                    {...register('subject')}
                    className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
                  />
                  {errors.subject && (
                    <span className="text-xs text-red-400 mt-1 block">{errors.subject.message}</span>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Votre message"
                  {...register('message')}
                  className="w-full px-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500 resize-none"
                />
                {errors.message && (
                  <span className="text-xs text-red-400 mt-1 block">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gold-gradient hover:bg-gold-gradient-hover shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Far Right Image Column */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden border border-brand-gold/30 shadow-2xl">
              <Image
                src="/images/contact-mask.png"
                alt="Soumangourou Art & Vase"
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Embedded Google Maps */}
        {mapEmbedUrl && (
          <div className="mt-16 rounded-3xl overflow-hidden border border-brand-gold/20 shadow-xl h-64 w-full">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </section>
  );
};
