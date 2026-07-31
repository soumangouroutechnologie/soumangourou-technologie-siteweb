import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, Clock, ArrowLeft, Share2, MessageSquare } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, TwitterXIcon } from '@/components/ui/SocialIcons';

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return { title: 'Article non trouvé' };

  return {
    title: `${post.seoTitle || post.title} | SOUMANGOUROU TECHNOLOGIE`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      comments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-dark text-brand-beige selection:bg-brand-gold selection:text-brand-dark">
      <Header />

      <article className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux articles</span>
        </Link>

        {/* Category Pill */}
        {post.category && (
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3.5 py-1.5 rounded-full inline-block mb-4">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-beigeLight tracking-tight leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta Author & Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-brand-gold/15 mb-8 text-xs text-brand-beige/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold/20 text-brand-gold font-bold flex items-center justify-center text-sm">
              {(post.authorName || 'Soumangourou').charAt(0)}
            </div>
            <div>
              <p className="font-bold text-white text-sm">{post.authorName || 'Équipe Soumangourou'}</p>
              <div className="flex items-center space-x-3 text-[11px] text-brand-beige/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-gold" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-gold" />
                  {post.readingTime} min de lecture
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-brand-beige/60 mr-2 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-brand-gold" /> Partager:
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://soumangourou.tech/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-brand-darkCard border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://soumangourou.tech/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-brand-darkCard border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=https://soumangourou.tech/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-brand-darkCard border border-brand-gold/20 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all"
            >
              <TwitterXIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-10 border border-brand-gold/30 shadow-2xl">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Post Content Body */}
        <div
          className="prose prose-invert max-w-none text-brand-beige/90 leading-relaxed text-base space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        {post.allowComments && (
          <section className="mt-16 pt-10 border-t border-brand-gold/20">
            <h3 className="text-2xl font-bold text-brand-beigeLight mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-gold" />
              Commentaires ({post.comments.length})
            </h3>

            {post.comments.length === 0 ? (
              <p className="text-sm text-brand-beige/60">Soyez le premier à commenter cet article.</p>
            ) : (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-brand-darkCard border border-brand-gold/15">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">{comment.name}</span>
                      <span className="text-[10px] text-brand-beige/50">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-xs text-brand-beige/80">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
