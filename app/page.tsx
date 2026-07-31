import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { ProjectsCarousel } from '@/components/sections/ProjectsCarousel';
import { AboutSection } from '@/components/sections/AboutSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 0; // Fresh content from CMS

export default async function HomePage() {
  // Fetch dynamic content from database
  const [settings, projects, blogPosts, socials] = await Promise.all([
    prisma.settings.findUnique({ where: { id: 'default' } }),
    prisma.project.findMany({
      include: { category: true },
      orderBy: { order: 'asc' },
    }),
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <main className="min-h-screen bg-brand-dark font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      {/* Sticky Header Navbar */}
      <Header />

      {/* Hero Section with Video Background & CMS Titles */}
      <Hero
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle}
        videoUrl={settings?.heroVideoUrl}
      />

      {/* Projects Dynamic Carousel Section */}
      <ProjectsCarousel projects={projects as any} />

      {/* About Section with CMS Settings */}
      <AboutSection settings={settings as any} />

      {/* Blog Section */}
      <BlogSection posts={blogPosts as any} />

      {/* Contact Section with CMS Settings */}
      <ContactSection socials={socials as any} settings={settings as any} />

      {/* Footer with CMS Settings */}
      <Footer settings={settings as any} socials={socials as any} />
    </main>
  );
}
