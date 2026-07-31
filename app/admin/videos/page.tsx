'use client';

import React, { useState, useEffect } from 'react';
import { YoutubeVideoItem } from '@/lib/types';
import { Plus, Video, Play, Trash2 } from 'lucide-react';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([]);
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVideos = async () => {
    const res = await fetch('/api/youtube');
    if (res.ok) {
      const data = await res.json();
      setVideos(data);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId) return;

    await fetch('/api/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, youtubeId }),
    });

    setTitle('');
    setYoutubeId('');
    fetchVideos();
  };

  const handleDeleteVideo = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/youtube?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
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
      <div>
        <h1 className="text-3xl font-extrabold text-brand-beigeLight">
          Gestion des Vidéos YouTube
        </h1>
        <p className="text-sm text-brand-beige/70 mt-1">
          Ajoutez des liens de vidéos YouTube ou des identifiants de playlist à afficher sur le site.
        </p>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddVideo} className="p-6 rounded-2xl bg-brand-darkCard border border-brand-gold/20 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-brand-beige/80 mb-1">Titre de la vidéo</label>
          <input
            type="text"
            required
            placeholder="Ex: Présentation de Soumangourou"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-brand-beige/80 mb-1">ID YouTube (ex: dQw4w9WgXcQ)</label>
          <input
            type="text"
            required
            placeholder="dQw4w9WgXcQ"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </form>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div key={vid.id} className="p-4 rounded-2xl bg-brand-darkCard border border-brand-gold/20 relative group">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3">
              <img
                src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                alt={vid.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                <Play className="w-8 h-8 text-brand-gold fill-current" />
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVideo(vid.id);
                }}
                disabled={deletingId === vid.id}
                title="Supprimer la vidéo"
                className="absolute top-2 right-2 z-30 pointer-events-auto cursor-pointer p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-bold text-sm text-white line-clamp-1">{vid.title}</h4>
            <p className="text-xs text-brand-gold mt-1 font-mono">{vid.youtubeId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
