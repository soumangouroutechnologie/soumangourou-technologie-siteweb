'use client';

import React, { useState, useEffect } from 'react';
import { BlogPostItem } from '@/lib/types';
import { Plus, FileText, Calendar, Clock, Trash2, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    readingTime: '5',
    status: 'PUBLISHED',
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
      
      setFormData((prev) => ({ ...prev, featuredImage: publicUrlData.publicUrl }));
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
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', excerpt: '', content: '', featuredImage: '', readingTime: '5', status: 'PUBLISHED' });
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
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
            Gestion du Blog & Articles
          </h1>
          <p className="text-sm text-brand-beige/70 mt-1">
            Rédigez, publiez et gérez les articles de blog affichés sur le site.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un article</span>
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brand-beige/60">Chargement des articles...</p>
      ) : posts.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-brand-darkCard border border-brand-gold/20 text-brand-beige/60">
          Aucun article pour le moment. Cliquez sur "Créer un article" pour commencer.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-brand-darkCard border border-brand-gold/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{post.title}</h3>
                  <p className="text-xs text-brand-beige/70 line-clamp-1 mt-0.5">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-brand-beige/50 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-gold" />
                      {new Date(post.publishedAt || Date.now()).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-gold" />
                      {post.readingTime} min
                    </span>
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  title="Supprimer l'article"
                  className="p-2.5 rounded-xl bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-darkCard border border-brand-gold/30 p-6 rounded-3xl w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">Nouveau Article de Blog</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Titre de l'article</label>
                <input
                  type="text"
                  required
                  placeholder="Titre accrocheur..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Extrait court</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Résumé de 2-3 lignes..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Contenu complet</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Rédigez votre article ici..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Image de couverture</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://... ou téléchargez une image"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
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
                {formData.featuredImage && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-brand-gold/20">
                    <img src={formData.featuredImage} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Temps de lecture (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-brand-beige/80 mb-1 font-bold">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-brand-dark border border-brand-gold/20 text-sm text-white"
                  >
                    <option value="PUBLISHED">Publié</option>
                    <option value="DRAFT">Brouillon</option>
                  </select>
                </div>
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
                  Publier l'article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
