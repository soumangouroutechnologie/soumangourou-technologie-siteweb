const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cleaning fake seed data & setting up clean defaults...');

  // 1. Delete fake projects, categories, fake blog posts, and comments
  await prisma.postTag.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.projectCategory.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('🧹 Fake seed data cleared!');

  // 2. Admin User
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@soumangourou.tech' },
    update: {},
    create: {
      email: 'admin@soumangourou.tech',
      name: 'Administrateur Soumangourou',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user verified:', admin.email);

  // 3. Default Site Settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {
      heroTitle: 'SOUMANGOUROU TECHNOLOGIE',
      heroSubtitle: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      heroVideoUrl: '/videos/hero.mp4',
      heroCtaText: 'DÉCOUVRIR NOS PROJETS',
      heroCtaLink: '#projets',

      aboutBadge: 'À PROPOS DE NOUS →',
      aboutTitle: 'L\'innovation au service du développement africain',
      aboutMainText: 'SOUMANGOUROU TECHNOLOGIE est une entreprise ivoirienne spécialisée dans la conception de solutions numériques modernes et accessibles.',
      aboutSubText: 'Notre mission est d\'accompagner les entreprises, associations et entrepreneurs grâce à des outils performants, tout en valorisant notre identité et nos valeurs africaines.',
      aboutImageUrl: '/images/about-african-king.png',
      aboutBadgeStat: '100%',
      aboutBadgeLabel: 'Excellence | Savoir-faire Africain',

      aboutValue1Title: 'Écoute & Conseil',
      aboutValue1Desc: 'Nous comprenons vos besoins pour vous proposer les meilleures solutions.',
      aboutValue2Title: 'Qualité & Performance',
      aboutValue2Desc: 'Nous développons des produits fiables, sécurisés et évolutifs.',
      aboutValue3Title: 'Innovation',
      aboutValue3Desc: 'Nous intégrons les dernières technologies pour vous garder en avance.',
      aboutValue4Title: 'Engagement Africain',
      aboutValue4Desc: 'Nous valorisons notre culture et contribuons à l\'essor du numérique en Afrique.',

      companyEmail: 'info@soumangouroutechnologie.com',
      companyPhone: '+2250706045256',
      companyAddress: 'Abidjan, Côte d\'Ivoire',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127108.64724773802!2d-4.049449830578613!3d5.348443905470125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8e34927f8a7e5%3A0x6b772413158f4a3e!2sAbidjan%2C%20C%C3%B4te%20d\'Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr',

      footerTagline: 'Concepteur de solutions digitales d\'excellence inspirées de l\'héritage africain.',
      copyrightText: '© 2026 SOUMANGOUROU TECHNOLOGIE. Tous droits réservés.',
    },
    create: {
      id: 'default',
      heroTitle: 'SOUMANGOUROU TECHNOLOGIE',
      heroSubtitle: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      heroVideoUrl: '/videos/hero.mp4',
      heroCtaText: 'DÉCOUVRIR NOS PROJETS',
      heroCtaLink: '#projets',

      aboutBadge: 'À PROPOS DE NOUS →',
      aboutTitle: 'L\'innovation au service du développement africain',
      aboutMainText: 'SOUMANGOUROU TECHNOLOGIE est une entreprise ivoirienne spécialisée dans la conception de solutions numériques modernes et accessibles.',
      aboutSubText: 'Notre mission est d\'accompagner les entreprises, associations et entrepreneurs grâce à des outils performants, tout en valorisant notre identité et nos valeurs africaines.',
      aboutImageUrl: '/images/about-african-king.png',
      aboutBadgeStat: '100%',
      aboutBadgeLabel: 'Excellence | Savoir-faire Africain',

      aboutValue1Title: 'Écoute & Conseil',
      aboutValue1Desc: 'Nous comprenons vos besoins pour vous proposer les meilleures solutions.',
      aboutValue2Title: 'Qualité & Performance',
      aboutValue2Desc: 'Nous développons des produits fiables, sécurisés et évolutifs.',
      aboutValue3Title: 'Innovation',
      aboutValue3Desc: 'Nous intégrons les dernières technologies pour vous garder en avance.',
      aboutValue4Title: 'Engagement Africain',
      aboutValue4Desc: 'Nous valorisons notre culture et contribuons à l\'essor du numérique en Afrique.',

      companyEmail: 'info@soumangouroutechnologie.com',
      companyPhone: '+2250706045256',
      companyAddress: 'Abidjan, Côte d\'Ivoire',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127108.64724773802!2d-4.049449830578613!3d5.348443905470125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb8e34927f8a7e5%3A0x6b772413158f4a3e!2sAbidjan%2C%20C%C3%B4te%20d\'Ivoire!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr',

      footerTagline: 'Concepteur de solutions digitales d\'excellence inspirées de l\'héritage africain.',
      copyrightText: '© 2026 SOUMANGOUROU TECHNOLOGIE. Tous droits réservés.',
    },
  });

  // 4. Default SEO Settings
  await prisma.seoSettings.upsert({
    where: { id: 'default' },
    update: {
      siteTitle: 'SOUMANGOUROU TECHNOLOGIE | Agence Digital & Excellence Africaine',
      siteDescription: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      keywords: ['technologie africaine', 'développement web', 'application mobile', 'intelligence artificielle', 'UX UI design', 'Abidjan'],
      twitterHandle: '@soumangourou_tech',
    },
    create: {
      id: 'default',
      siteTitle: 'SOUMANGOUROU TECHNOLOGIE | Agence Digital & Excellence Africaine',
      siteDescription: 'Nous concevons des solutions digitales modernes pour accompagner les entreprises africaines vers l\'excellence.',
      keywords: ['technologie africaine', 'développement web', 'application mobile', 'intelligence artificielle', 'UX UI design', 'Abidjan'],
      twitterHandle: '@soumangourou_tech',
    },
  });

  console.log('✅ Site settings & SEO defaults initialized successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
