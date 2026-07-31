'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  caption?: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    imageUrl: '',
  });

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filename = `${Date.now()}-${safeName}.${ext}`;

      const { error } = await supabase.storage
        .from('uploads')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filename);
      
      setFormData((prev) => ({ ...prev, imageUrl: publicUrlData.publicUrl }));
    } catch (err) {
      console.error('Erreur upload:', err);
      alert("Erreur lors du téléchargement de l'image. Veuillez réessayer avec une image plus petite.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', caption: '', imageUrl: '' });
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setImages(images.filter((img) => img.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-beigeLight">
            Gestion de la Galerie Media
          </h1>
          <p className="text-sm text-brand-beige/70 mt-1">
            Gérez vos collections de photos, photos d'événements et réalisations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une image</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brand-beige/60">Chargement de la galerie...</p>
      ) : images.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-brand-darkCard border border-brand-gold/20 text-brand-beige/60">
          Aucune photo dans la galerie pour le moment. Cliquez sur "Ajouter une image" pour en ajouter une.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="p-3 rounded-2xl bg-brand-darkCard border border-brand-gold/20 shadow-lg relative group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-zinc-900">
                <Image src={img.imageUrl} alt={img.title || 'Galerie'} fill className="object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img.id);
                  }}
                  disabled={deletingId === img.id}
                  title="Supprimer la photo"
                  className="absolute top-2 right-2 z-30 pointer-events-auto cursor-pointer p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {img.title && <h4 className="font-bold text-xs text-white truncate">{img.title}</h4>}
              {img.caption && <p className="text-[10px] text-brand-beige/60 truncate">{img.caption}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Photo */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-darkCard border border-brand-gold/30 p-6 rounded-3xl w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Nouvelle Image dans la Galerie</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="https://... ou téléchargez"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                  <label className="p-3 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors cursor-pointer flex items-center justify-center shrink-0">
                    {uploading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-brand-gold/20">
                    <img src={formData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Titre (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Équipe Soumangourou"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Légende (Optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Séance de travail à Abidjan"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-brand-beige/70 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-gold-gradient text-white shadow-lg disabled:opacity-50"
                >
                  Ajouter à la Galerie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
