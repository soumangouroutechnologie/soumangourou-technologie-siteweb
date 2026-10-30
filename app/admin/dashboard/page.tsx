import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminFromCookies } from '@/lib/auth';
import { FolderKanban, FileText, Mail, Video, ArrowUpRight, Sparkles } from 'lucide-react';

export const revalidate = 0; // Fresh admin dashboard stats

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    redirect('/admin/login');
  }

  const [projectsCount, postsCount, messagesCount, videosCount, recentMessages] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.contactMessage.count(),
    prisma.youtubeVideo.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const statCards = [
    { title: 'Projets au catalogue', count: projectsCount, icon: FolderKanban, href: '/admin/projects' },
    { title: 'Articles de Blog', count: postsCount, icon: FileText, href: '/admin/blog' },
    { title: 'Messages de Contact', count: messagesCount, icon: Mail, href: '/admin/messages' },
    { title: 'Vidéos YouTube', count: videosCount, icon: Video, href: '/admin/videos' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-3xl bg-gradient-to-r from-brand-darkCard via-brand-darkCard to-brand-gold/10 border border-brand-gold/25 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SOUMANGOUROU CMS ADMIN</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-beigeLight">
            Bienvenue sur votre Espace d'Administration
          </h1>
          <p className="text-sm text-brand-beige/70 mt-1">
            Gérez en toute simplicité le contenu, les projets et les messages de votre site web.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-goldHover transition-all shadow-lg"
        >
          <span>Accéder au site public</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="p-6 rounded-2xl bg-brand-darkCard border border-brand-gold/20 hover:border-brand-gold/50 transition-all duration-300 group shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/30 text-brand-gold group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-brand-beige/40 group-hover:text-brand-gold transition-colors" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-beige/70">
                {card.title}
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {card.count}
              </h3>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-brand-darkCard border border-brand-gold/20 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-brand-beigeLight">
            Derniers messages reçus
          </h3>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-brand-gold hover:underline"
          >
            Voir tous les messages →
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-sm text-brand-beige/60 py-4">Aucun message pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl bg-brand-dark border border-brand-gold/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{msg.fullName}</span>
                    <span className="text-xs text-brand-gold">({msg.email})</span>
                  </div>
                  <p className="text-xs text-brand-beige/80 font-semibold">{msg.subject}</p>
                  <p className="text-xs text-brand-beige/60 line-clamp-1 mt-1">{msg.message}</p>
                </div>
                <span className="text-[10px] text-brand-beige/50 shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
