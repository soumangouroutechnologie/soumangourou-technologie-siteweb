import { PrismaClient, Role, PostStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@soumangourou.tech' },
    update: {},
    create: {
      email: 'admin@soumangourou.tech',
      name: 'Administrateur Soumangourou',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log('👤 Admin user created:', admin.email);

  // 2. Default Site Settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroTitle: 'SOUMANGOUROU TECHNOLOGIE',
      heroSubtitle: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      heroVideoUrl: '/videos/hero.mp4',
      companyEmail: 'contact@soumangourou.tech',
      companyPhone: '+225 07 08 09 10 11',
      companyAddress: 'Abidjan, Côte d\'Ivoire',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127108.64724773802!2d-4.049449830578613!3d5.348443905470125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8e34927f8a7e5%3A0x6b772413158f4a3e!2sAbidjan%2C%20C%C3%B4te%20d\'Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr',
    },
  });

  await prisma.seoSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteTitle: 'SOUMANGOUROU TECHNOLOGIE | Agence Digital & Excellence Africaine',
      siteDescription: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      keywords: ['technologie africaine', 'développement web', 'application mobile', 'intelligence artificielle', 'UX UI design', 'Abidjan'],
      twitterHandle: '@soumangourou_tech',
    },
  });

  // 3. Project Categories
  const catSaaS = await prisma.projectCategory.upsert({
    where: { slug: 'saas-logiciel' },
    update: {},
    create: { name: 'SaaS & Logiciels', slug: 'saas-logiciel', description: 'Solutions applicatives cloud et gestion d\'entreprise' },
  });

  const catAI = await prisma.projectCategory.upsert({
    where: { slug: 'intelligence-artificielle' },
    update: {},
    create: { name: 'Intelligence Artificielle', slug: 'intelligence-artificielle', description: 'Plateformes propulsées par IA' },
  });

  const catWeb = await prisma.projectCategory.upsert({
    where: { slug: 'applications-web' },
    update: {},
    create: { name: 'Applications Web', slug: 'applications-web', description: 'Plateformes interactives et vitrines sur mesure' },
  });

  // 4. Projects (Matching Mockup)
  const projectsData = [
    {
      title: 'Bamousso RH',
      slug: 'bamousso-rh',
      summary: 'Solution complète de gestion des ressources humaines pour les entreprises.',
      description: 'Bamousso RH est une plateforme intuitive de gestion de la paie, des congés, du recrutement et de l\'évaluation des performances conçue pour les entreprises en forte croissance en Afrique.',
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: 'https://bamousso.tech',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma'],
      categoryId: catSaaS.id,
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Melodia AI',
      slug: 'melodia-ai',
      summary: 'Plateforme de génération musicale par intelligence artificielle.',
      description: 'Melodia AI combine les sonorités traditionnelles africaines avec des algorithmes d\'IA avancés pour générer des bandes sonores uniques et libres de droits.',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: 'https://melodia.ai',
      technologies: ['React', 'Python', 'FastAPI', 'PyTorch', 'Tailwind CSS'],
      categoryId: catAI.id,
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Carte Fidelis',
      slug: 'carte-fidelis',
      summary: 'Programme de fidélité digital pour récompenser vos clients.',
      description: 'Une solution de carte de fidélité dématérialisée intégrable sur mobile via QR code et WhatsApp pour booster la rétention client des commerces locaux.',
      coverImage: 'https://images.unsplash.com/photo-1556742049-0a67daf4004a?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1556742049-0a67daf4004a?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: 'https://fidelis.app',
      technologies: ['React Native', 'Node.js', 'Express', 'Supabase'],
      categoryId: catWeb.id,
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Landing Pages Premium',
      slug: 'landing-pages-premium',
      summary: 'Des landing pages modernes et performantes pour booster vos conversions.',
      description: 'Conception de pages d\'atterrissage ultra-optimisées pour le taux de conversion, intégrant animations fluides, glassmorphism et copywriting percutant.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: 'https://soumangourou.tech',
      technologies: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
      categoryId: catWeb.id,
      isFeatured: true,
      order: 4,
    },
    {
      title: 'Sites Vitrines',
      slug: 'sites-vitrines-sur-mesure',
      summary: 'Sites web professionnels sur mesure pour valoriser votre activité.',
      description: 'Développement de sites d\'entreprise de classe internationale mettant en relief votre savoir-faire et votre identité de marque.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
      ],
      liveUrl: 'https://soumangourou.tech',
      technologies: ['Next.js', 'Prisma', 'TypeScript', 'SEO'],
      categoryId: catWeb.id,
      isFeatured: true,
      order: 5,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: proj,
    });
  }
  console.log('🚀 Projects seeded!');

  // 5. Services
  const servicesData = [
    {
      title: 'Écoute & Conseil',
      slug: 'ecoute-et-conseil',
      description: 'Nous comprenons vos besoins pour vous proposer les meilleures solutions digitales adaptées à votre marché.',
      icon: 'Headphones',
      order: 1,
    },
    {
      title: 'Qualité & Performance',
      slug: 'qualite-et-performance',
      description: 'Nous développons des produits fiables, sécurisés et évolutifs garantissant une vitesse d\'exécution optimale.',
      icon: 'ShieldCheck',
      order: 2,
    },
    {
      title: 'Innovation',
      slug: 'innovation',
      description: 'Nous intégrons les dernières technologies d\'intelligence artificielle et d\'UX moderne pour vous garder en avance.',
      icon: 'Cpu',
      order: 3,
    },
    {
      title: 'Engagement Africain',
      slug: 'engagement-africain',
      description: 'Nous valorisons notre culture et contribuons activement à l\'essor du numérique et du patrimoine en Afrique.',
      icon: 'Award',
      order: 4,
    },
  ];

  for (const srv of servicesData) {
    await prisma.service.upsert({
      where: { slug: srv.slug },
      update: {},
      create: srv,
    });
  }
  console.log('⚡ Services seeded!');

  // 6. Blog Categories & Posts
  const blogCatTech = await prisma.category.upsert({
    where: { slug: 'technologie' },
    update: {},
    create: { name: 'Technologie & Innovation', slug: 'technologie', description: 'Toutes les actualités sur l\'innovation africaine' },
  });

  const blogCatDesign = await prisma.category.upsert({
    where: { slug: 'design-ux' },
    update: {},
    create: { name: 'Design & Héritage', slug: 'design-ux', description: 'Mariage entre identité culturelle et design moderne' },
  });

  const tagIA = await prisma.tag.upsert({
    where: { slug: 'ia' },
    update: {},
    create: { name: 'Intelligence Artificielle', slug: 'ia' },
  });

  const post1 = await prisma.blogPost.upsert({
    where: { slug: 'impact-ia-transformation-digitale-afrique' },
    update: {},
    create: {
      title: 'L\'impact de l\'IA dans la transformation digitale en Afrique',
      slug: 'impact-ia-transformation-digitale-afrique',
      excerpt: 'Découvrez comment l\'intelligence artificielle révolutionne la productivité et la création de valeur dans les entreprises africaines.',
      content: '<p>L\'Afrique est en passe de devenir le nouveau hub mondial de l\'innovation digitale. Grâce à l\'intégration judicieuse de l\'Intelligence Artificielle, les entreprises locales peuvent franchir des étapes d\'évolution à une vitesse sans précédent...</p><h2>1. Automatisation et efficacité</h2><p>L\'IA permet d\'automatiser les tâches répétitives et d\'offrir un service client réactif 24/7 grâce aux agents autonomes.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      status: PostStatus.PUBLISHED,
      readingTime: 6,
      authorId: admin.id,
      authorName: 'Mamadou Soumangourou',
      categoryId: blogCatTech.id,
      seoTitle: 'IA et Transformation Digitale en Afrique | Soumangourou',
      seoDescription: 'Analyse approfondie de l\'impact de l\'intelligence artificielle sur les entreprises africaines.',
    },
  });

  await prisma.postTag.upsert({
    where: { postId_tagId: { postId: post1.id, tagId: tagIA.id } },
    update: {},
    create: { postId: post1.id, tagId: tagIA.id },
  });

  const post2 = await prisma.blogPost.upsert({
    where: { slug: 'identite-visuelle-patrimoine-africain-web' },
    update: {},
    create: {
      title: 'Valoriser le patrimoine africain à travers le web design moderne',
      slug: 'identite-visuelle-patrimoine-africain-web',
      excerpt: 'Comment marier esthétique épurée internationale et symboles culturels africains pour créer une image de marque inoubliable.',
      content: '<p>Le design ne doit pas seulement être fonctionnel, il doit raconter une histoire. En puisant dans les palettes de couleurs nobles telles que le bronze, l\'or et les tons terreux, nous créons des interfaces qui inspirent respect et prestige...</p>',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      status: PostStatus.PUBLISHED,
      readingTime: 4,
      authorId: admin.id,
      authorName: 'Awa Koné',
      categoryId: blogCatDesign.id,
      seoTitle: 'Web Design & Patrimoine Africain | Soumangourou',
      seoDescription: 'Guide pour concilier design moderne et richesse culturelle africaine.',
    },
  });

  console.log('📰 Blog posts seeded!');

  // 7. YouTube Videos & Playlists
  await prisma.youtubeVideo.createMany({
    data: [
      {
        title: 'Présentation de SOUMANGOUROU TECHNOLOGIE',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Découvrez notre vision et notre engagement pour le numérique africain.',
        order: 1,
      },
      {
        title: 'Interview Fondateur : Concilier Innovation et Héritage',
        youtubeId: 'dQw4w9WgXcQ',
        description: 'Discussion autour des enjeux technologiques en Côte d\'Ivoire.',
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  // 8. Social Links
  const socialData = [
    { platform: 'Facebook', url: 'https://facebook.com', icon: 'Facebook', order: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', order: 2 },
    { platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', order: 3 },
    { platform: 'TikTok', url: 'https://tiktok.com', icon: 'Video', order: 4 },
    { platform: 'YouTube', url: 'https://youtube.com', icon: 'Youtube', order: 5 },
    { platform: 'GitHub', url: 'https://github.com', icon: 'Github', order: 6 },
  ];

  for (const s of socialData) {
    await prisma.socialLink.upsert({
      where: { platform: s.platform },
      update: {},
      create: s,
    });
  }
  console.log('🌐 Social links seeded!');

  // 9. Gallery
  const gallery = await prisma.gallery.upsert({
    where: { slug: 'realisations-2026' },
    update: {},
    create: {
      title: 'Nos Réalisations & Événements',
      slug: 'realisations-2026',
      category: 'Réalisations',
      description: 'Aperçu photographique des moments forts et projets de l\'agence.',
    },
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        galleryId: gallery.id,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        title: 'Session Design Thinking',
        caption: 'Co-création avec nos clients à Abidjan',
        order: 1,
      },
      {
        galleryId: gallery.id,
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        title: 'Équipe SOUMANGOUROU',
        caption: 'Nos développeurs et designers passionnés',
        order: 2,
      },
      {
        galleryId: gallery.id,
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        title: 'Lancement Bamousso RH',
        caption: 'Célébration du déploiement de la solution',
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  console.log('🖼️ Gallery seeded!');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
