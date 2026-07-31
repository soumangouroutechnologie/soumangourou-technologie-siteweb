'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Connexion échouée');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-brand-darkCard/90 backdrop-blur-2xl border border-brand-gold/30 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo variant="light" className="mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Espace d'Administration</span>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-beige/80 mb-2">
              Adresse Email Admin
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@soumangourou.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
              />
              <Mail className="w-4 h-4 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-beige/80 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-brand-dark border border-brand-gold/20 focus:border-brand-gold focus:outline-none text-sm text-white placeholder-zinc-500"
              />
              <Lock className="w-4 h-4 text-brand-gold absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gold-gradient hover:bg-gold-gradient-hover shadow-lg transition-all transform active:scale-95 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Vérification...' : 'Se connecter au CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
