import { prisma } from '@/lib/prisma';
import { Mail, Phone, Building, Calendar, CheckCircle } from 'lucide-react';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const [messages, subscribers] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-beigeLight">
          Inbox & Messages Reçus
        </h1>
        <p className="text-sm text-brand-beige/70 mt-1">
          Consultez les demandes de contact envoyées par vos clients et prospects.
        </p>
      </div>

      {/* Messages List */}
      <div className="bg-brand-darkCard border border-brand-gold/20 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Messages Formulaire ({messages.length})</h3>

        {messages.length === 0 ? (
          <p className="text-sm text-brand-beige/60">Aucun message pour le moment.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-2xl bg-brand-dark border border-brand-gold/15 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-white">{msg.fullName}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gold mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {msg.phone}
                      </span>
                    )}
                    {msg.company && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" /> {msg.company}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-brand-beige/50 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-gold" />
                  {new Date(msg.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>

              <div className="pt-2 border-t border-brand-gold/10">
                <span className="text-xs font-bold text-brand-beige uppercase tracking-wider block mb-1">
                  Sujet : {msg.subject}
                </span>
                <p className="text-sm text-brand-beige/80 leading-relaxed bg-brand-darkCard/60 p-3 rounded-xl">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Newsletter Subscribers */}
      <div className="bg-brand-darkCard border border-brand-gold/20 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Abonnés Newsletter ({subscribers.length})</h3>
        <div className="flex flex-wrap gap-2">
          {subscribers.map((sub) => (
            <span
              key={sub.id}
              className="px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-mono"
            >
              {sub.email}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
