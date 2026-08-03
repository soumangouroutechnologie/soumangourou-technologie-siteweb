import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOUMANGOUROU TECHNOLOGIE | Agence Digital & Excellence Africaine',
  description: 'Nous concevons des solutions digitales modernes inspirées par notre héritage africain pour accompagner les entreprises vers l\'excellence.',
  keywords: ['SOUMANGOUROU TECHNOLOGIE', 'développement web', 'application mobile', 'intelligence artificielle', 'Abidjan', 'Côte d\'Ivoire', 'UX UI design'],
  authors: [{ name: 'SOUMANGOUROU TECHNOLOGIE' }],
  openGraph: {
    title: 'SOUMANGOUROU TECHNOLOGIE',
    description: 'Solutions digitales modernes inspirées de l\'héritage africain.',
    url: 'https://soumangouroutechnologie.com',
    siteName: 'SOUMANGOUROU TECHNOLOGIE',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOUMANGOUROU TECHNOLOGIE',
    description: 'Solutions digitales modernes inspirées de l\'héritage africain.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SOUMANGOUROU TECHNOLOGIE',
    url: 'https://soumangouroutechnologie.com',
    logo: 'https://soumangouroutechnologie.com/images/hero-african-king.png',
    description: 'Solutions digitales modernes inspirées par notre héritage africain.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2250708091011',
      contactType: 'customer service',
      email: 'info@soumangouroutechnologie.com',
    },
  };

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-dark text-brand-beige font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
