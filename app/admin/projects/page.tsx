'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProjectItem } from '@/lib/types';
import { Plus, Trash2, ExternalLink, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    coverImage: '',
    liveUrl: '',
    technologies: '',
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
      
      setFormData((prev) => ({ ...prev, coverImage: publicUrlData.publicUrl }));
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
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: techArray,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', summary: '', description: '', coverImage: '', liveUrl: '', technologies: '' });
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-beigeLight">
            Gestion des Projets
          </h1>
          <p className="text-sm text-brand-beige/70 mt-1">
            Ajoutez et modifiez les projets affichés dans le catalogue du site.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un projet</span>
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <p className="text-sm text-brand-beige/60">Chargement des projets...</p>
      ) : projects.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-brand-darkCard border border-brand-gold/20 text-brand-beige/60">
          Aucun projet pour le moment. Cliquez sur "Ajouter un projet" pour en ajouter un.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-brand-darkCard border border-brand-gold/20 rounded-2xl overflow-hidden shadow-lg p-5 flex flex-col justify-between relative group"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-zinc-900">
                  <Image src={proj.coverImage} alt={proj.title} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(proj.id);
                    }}
                    disabled={deletingId === proj.id}
                    title="Supprimer le projet"
                    className="absolute top-2 right-2 z-30 pointer-events-auto cursor-pointer p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{proj.title}</h3>
                <p className="text-xs text-brand-beige/70 line-clamp-2 mb-4">{proj.summary}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.technologies.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-brand-gold/10 border border-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-brand-gold/10 flex items-center justify-between text-xs">
                {proj.liveUrl ? (
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-brand-gold flex items-center gap-1">
                    <span>Visiter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-brand-beige/40">Projet interne</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-darkCard border border-brand-gold/30 p-6 rounded-3xl w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">Nouveau Projet</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Titre du projet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Application Web E-commerce"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Résumé court</label>
                <input
                  type="text"
                  required
                  placeholder="Bref résumé affiché sur la carte"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Image de couverture</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="https://... ou téléchargez une image"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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
                {formData.coverImage && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-brand-gold/20">
                    <img src={formData.coverImage} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Lien Live du projet (Optionnel)</label>
                <input
                  type="url"
                  placeholder="https://monprojet.tech"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Technologies (séparées par une virgule)</label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, Tailwind CSS"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
