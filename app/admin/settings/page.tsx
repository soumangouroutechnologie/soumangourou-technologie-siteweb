'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Sparkles, Layout, Info, MapPin, Search, Menu as MenuIcon, Palette, Plus, Trash2, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'contact' | 'footer' | 'menu' | 'colors'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    // Hero
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    heroCtaText: '',
    heroCtaLink: '',

    // About
    aboutBadge: '',
    aboutTitle: '',
    aboutMainText: '',
    aboutSubText: '',
    aboutImageUrl: '',
    aboutBadgeStat: '',
    aboutBadgeLabel: '',

    // About Values
    aboutValue1Title: '',
    aboutValue1Desc: '',
    aboutValue2Title: '',
    aboutValue2Desc: '',
    aboutValue3Title: '',
    aboutValue3Desc: '',
    aboutValue4Title: '',
    aboutValue4Desc: '',

    // Contact
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    mapEmbedUrl: '',

    // Footer
    footerTagline: '',
    copyrightText: '',

    // Theme & Menu
    primaryColor: '#D4AF37',
    darkBgColor: '#0B0B0C',
    beigeBgColor: '#F7F5F0',
  });

  const [menuItems, setMenuItems] = useState<{ name: string; href: string }[]>([
    { name: 'Accueil', href: '#accueil' },
    { name: 'Nos projets', href: '#projets' },
    { name: 'À propos', href: '#a-propos' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ]);

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    keywordsStr: '',
    twitterHandle: '',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings({
          heroTitle: data.settings.heroTitle || '',
          heroSubtitle: data.settings.heroSubtitle || '',
          heroVideoUrl: data.settings.heroVideoUrl || '',
          heroCtaText: data.settings.heroCtaText || '',
          heroCtaLink: data.settings.heroCtaLink || '',

          aboutBadge: data.settings.aboutBadge || '',
          aboutTitle: data.settings.aboutTitle || '',
          aboutMainText: data.settings.aboutMainText || '',
          aboutSubText: data.settings.aboutSubText || '',
          aboutImageUrl: data.settings.aboutImageUrl || '',
          aboutBadgeStat: data.settings.aboutBadgeStat || '',
          aboutBadgeLabel: data.settings.aboutBadgeLabel || '',

          aboutValue1Title: data.settings.aboutValue1Title || '',
          aboutValue1Desc: data.settings.aboutValue1Desc || '',
          aboutValue2Title: data.settings.aboutValue2Title || '',
          aboutValue2Desc: data.settings.aboutValue2Desc || '',
          aboutValue3Title: data.settings.aboutValue3Title || '',
          aboutValue3Desc: data.settings.aboutValue3Desc || '',
          aboutValue4Title: data.settings.aboutValue4Title || '',
          aboutValue4Desc: data.settings.aboutValue4Desc || '',

          companyEmail:
            !data.settings.companyEmail || data.settings.companyEmail === 'contact@soumangourou.tech'
              ? 'info@soumangouroutechnologie.com'
              : data.settings.companyEmail,
          companyPhone:
            !data.settings.companyPhone ||
            data.settings.companyPhone === '+225 07 08 09 10 11' ||
            data.settings.companyPhone === '+2250708091011'
              ? '+2250706045256'
              : data.settings.companyPhone,
          companyAddress: data.settings.companyAddress || '',
          mapEmbedUrl: data.settings.mapEmbedUrl || '',

          footerTagline: data.settings.footerTagline || '',
          copyrightText: data.settings.copyrightText || '',

          primaryColor: data.settings.primaryColor || '#D4AF37',
          darkBgColor: data.settings.darkBgColor || '#0B0B0C',
          beigeBgColor: data.settings.beigeBgColor || '#F7F5F0',
        });

        if (Array.isArray(data.settings.menuItems) && data.settings.menuItems.length > 0) {
          setMenuItems(data.settings.menuItems);
        }
      }

      if (data.seoSettings) {
        setSeoSettings({
          siteTitle: data.seoSettings.siteTitle || '',
          siteDescription: data.seoSettings.siteDescription || '',
          keywordsStr: Array.isArray(data.seoSettings.keywords)
            ? data.seoSettings.keywords.join(', ')
            : '',
          twitterHandle: data.seoSettings.twitterHandle || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: 'Nouveau lien', href: '#section' }]);
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: 'name' | 'href', value: string) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const keywordsArray = seoSettings.keywordsStr
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settingsData: {
            ...settings,
            menuItems,
          },
          seoData: {
            siteTitle: seoSettings.siteTitle,
            siteDescription: seoSettings.siteDescription,
            keywords: keywordsArray,
            twitterHandle: seoSettings.twitterHandle,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-brand-gold gap-3">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold">Chargement des paramètres du site...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestion Globale du Site</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-beigeLight">
            Paramètres & Contenu du Site
          </h1>
          <p className="text-sm text-brand-beige/70 mt-1">
            Modifiez en direct tous les textes, images, menus, couleurs et SEO affichés sur le site.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg shrink-0 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement...' : 'Sauvegarder Tout'}</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Toutes les modifications ont été enregistrées avec succès ! Les visiteurs verront les changements immédiatement.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-3 text-sm">
          <span>{saveError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-brand-gold/20 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hero'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>1. Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'about'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>2. À Propos</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'contact'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>3. Contact</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'footer'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>4. SEO</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menu'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>5. Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'colors'
              ? 'bg-brand-gold text-brand-dark shadow-md'
              : 'bg-brand-darkCard text-brand-beige/80 border border-brand-gold/20 hover:border-brand-gold/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>6. Couleurs</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Hero */}
        {activeTab === 'hero' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-brand-gold/15">
              <Layout className="w-5 h-5" />
              Contenu de la Section Hero (Bannière d'Accueil)
            </h3>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Titre Principal (Hero)
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Sous-titre / Description (Hero)
              </label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                URL / Chemin de la Vidéo de Fond
              </label>
              <input
                type="text"
                value={settings.heroVideoUrl}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Texte du Bouton d'Action
                </label>
                <input
                  type="text"
                  value={settings.heroCtaText}
                  onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Lien du Bouton (ex: #projets ou #contact)
                </label>
                <input
                  type="text"
                  value={settings.heroCtaLink}
                  onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: About & 4 Values */}
        {activeTab === 'about' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-brand-gold/15">
              <Info className="w-5 h-5" />
              Contenu de la Section À Propos & Valeurs Clés
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Badge de la Section
                </label>
                <input
                  type="text"
                  value={settings.aboutBadge}
                  onChange={(e) => setSettings({ ...settings, aboutBadge: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  URL Image de la sculpture / Présentation
                </label>
                <input
                  type="text"
                  value={settings.aboutImageUrl}
                  onChange={(e) => setSettings({ ...settings, aboutImageUrl: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Titre Général de la Section
              </label>
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Paragraphe Principal (Présentation de l'Entreprise)
              </label>
              <textarea
                rows={3}
                value={settings.aboutMainText}
                onChange={(e) => setSettings({ ...settings, aboutMainText: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Paragraphe Secondaire (Mission & Culture)
              </label>
              <textarea
                rows={3}
                value={settings.aboutSubText}
                onChange={(e) => setSettings({ ...settings, aboutSubText: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Badge Statistique (ex: 100%)
                </label>
                <input
                  type="text"
                  value={settings.aboutBadgeStat}
                  onChange={(e) => setSettings({ ...settings, aboutBadgeStat: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Label Badge (ex: Excellence | Savoir-faire Africain)
                </label>
                <input
                  type="text"
                  value={settings.aboutBadgeLabel}
                  onChange={(e) => setSettings({ ...settings, aboutBadgeLabel: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* 4 Core Values */}
            <div className="pt-4 border-t border-brand-gold/20">
              <h4 className="text-sm font-bold text-white mb-4">Les 4 Valeurs Clés</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-brand-dark border border-brand-gold/15 space-y-3">
                  <span className="text-xs font-bold text-brand-gold">Valeur 1</span>
                  <input
                    type="text"
                    placeholder="Titre"
                    value={settings.aboutValue1Title}
                    onChange={(e) => setSettings({ ...settings, aboutValue1Title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={settings.aboutValue1Desc}
                    onChange={(e) => setSettings({ ...settings, aboutValue1Desc: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brand-dark border border-brand-gold/15 space-y-3">
                  <span className="text-xs font-bold text-brand-gold">Valeur 2</span>
                  <input
                    type="text"
                    placeholder="Titre"
                    value={settings.aboutValue2Title}
                    onChange={(e) => setSettings({ ...settings, aboutValue2Title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={settings.aboutValue2Desc}
                    onChange={(e) => setSettings({ ...settings, aboutValue2Desc: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brand-dark border border-brand-gold/15 space-y-3">
                  <span className="text-xs font-bold text-brand-gold">Valeur 3</span>
                  <input
                    type="text"
                    placeholder="Titre"
                    value={settings.aboutValue3Title}
                    onChange={(e) => setSettings({ ...settings, aboutValue3Title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={settings.aboutValue3Desc}
                    onChange={(e) => setSettings({ ...settings, aboutValue3Desc: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white resize-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-brand-dark border border-brand-gold/15 space-y-3">
                  <span className="text-xs font-bold text-brand-gold">Valeur 4</span>
                  <input
                    type="text"
                    placeholder="Titre"
                    value={settings.aboutValue4Title}
                    onChange={(e) => setSettings({ ...settings, aboutValue4Title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={settings.aboutValue4Desc}
                    onChange={(e) => setSettings({ ...settings, aboutValue4Desc: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-brand-darkCard border border-brand-gold/20 text-xs text-white resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-brand-gold/15">
              <MapPin className="w-5 h-5" />
              Coordonnées de Contact & Carte Google Maps
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Adresse Email de Contact
                </label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Numéro de Téléphone
                </label>
                <input
                  type="text"
                  value={settings.companyPhone}
                  onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Adresse Physique
              </label>
              <input
                type="text"
                value={settings.companyAddress}
                onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Lien d'Intégration Google Maps (URL iframe src)
              </label>
              <input
                type="text"
                value={settings.mapEmbedUrl}
                onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Footer & SEO */}
        {activeTab === 'footer' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-brand-gold/15">
              <Search className="w-5 h-5" />
              Pied de page & Optimisation SEO
            </h3>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Slogan du Footer
              </label>
              <input
                type="text"
                value={settings.footerTagline}
                onChange={(e) => setSettings({ ...settings, footerTagline: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                Texte Copyright
              </label>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="pt-4 border-t border-brand-gold/20 space-y-4">
              <h4 className="text-sm font-bold text-white">Référencement SEO & Réseaux Sociaux</h4>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Titre du site (Balise Meta Title)
                </label>
                <input
                  type="text"
                  value={seoSettings.siteTitle}
                  onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                  Description du site (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={seoSettings.siteDescription}
                  onChange={(e) => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                    Mots-clés SEO (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.keywordsStr}
                    onChange={(e) => setSeoSettings({ ...seoSettings, keywordsStr: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
                    Handle Twitter / X (ex: @soumangourou_tech)
                  </label>
                  <input
                    type="text"
                    value={seoSettings.twitterHandle}
                    onChange={(e) => setSeoSettings({ ...seoSettings, twitterHandle: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Menu Navigation */}
        {activeTab === 'menu' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2">
                <MenuIcon className="w-5 h-5" />
                Gestion des Éléments du Menu Principal
              </h3>
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-gold/20 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un élément</span>
              </button>
            </div>

            <div className="space-y-3">
              {menuItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-brand-dark border border-brand-gold/15">
                  <div className="flex-1">
                    <label className="block text-[10px] text-brand-gold font-bold uppercase mb-1">Nom du lien</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleMenuItemChange(idx, 'name', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-brand-darkCard border border-brand-gold/20 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] text-brand-gold font-bold uppercase mb-1">Lien / Ancre (ex: #projets)</label>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleMenuItemChange(idx, 'href', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-brand-darkCard border border-brand-gold/20 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMenuItem(idx)}
                    title="Supprimer l'élément"
                    className="p-2.5 mt-5 rounded-xl bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Colors & Theme */}
        {activeTab === 'colors' && (
          <div className="p-8 rounded-3xl bg-brand-darkCard border border-brand-gold/25 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-brand-gold flex items-center gap-2 pb-3 border-b border-brand-gold/15">
              <Palette className="w-5 h-5" />
              Personnalisation des Couleurs du Thème
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-brand-dark border border-brand-gold/20 space-y-3">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Couleur Principale (Accents & Or)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-brand-gold/30"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl bg-brand-darkCard border border-brand-gold/20 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-dark border border-brand-gold/20 space-y-3">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Fond Sombre (Mode Dark)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.darkBgColor}
                    onChange={(e) => setSettings({ ...settings, darkBgColor: e.target.value })}
                    className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-brand-gold/30"
                  />
                  <input
                    type="text"
                    value={settings.darkBgColor}
                    onChange={(e) => setSettings({ ...settings, darkBgColor: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl bg-brand-darkCard border border-brand-gold/20 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-dark border border-brand-gold/20 space-y-3">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Fond Clair (Section À propos)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.beigeBgColor}
                    onChange={(e) => setSettings({ ...settings, beigeBgColor: e.target.value })}
                    className="w-12 h-12 rounded-xl bg-transparent cursor-pointer border border-brand-gold/30"
                  />
                  <input
                    type="text"
                    value={settings.beigeBgColor}
                    onChange={(e) => setSettings({ ...settings, beigeBgColor: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl bg-brand-darkCard border border-brand-gold/20 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
