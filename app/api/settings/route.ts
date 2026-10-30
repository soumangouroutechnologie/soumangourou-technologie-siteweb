import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const [settings, seoSettings] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 'default' } }),
      prisma.seoSettings.findUnique({ where: { id: 'default' } }),
    ]);

    const normalizedSettings = settings
      ? {
          ...settings,
          companyEmail:
            !settings.companyEmail || settings.companyEmail === 'contact@soumangourou.tech'
              ? 'info@soumangouroutechnologie.com'
              : settings.companyEmail,
          companyPhone:
            !settings.companyPhone ||
            settings.companyPhone === '+225 07 08 09 10 11' ||
            settings.companyPhone === '+2250708091011'
              ? '+2250706045256'
              : settings.companyPhone,
        }
      : null;

    return NextResponse.json({ settings: normalizedSettings, seoSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des paramètres' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { settingsData, seoData } = body;

    const updatedSettings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: { ...settingsData },
      create: { id: 'default', ...settingsData },
    });

    let updatedSeo = null;
    if (seoData) {
      updatedSeo = await prisma.seoSettings.upsert({
        where: { id: 'default' },
        update: { ...seoData },
        create: { id: 'default', ...seoData },
      });
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      seoSettings: updatedSeo,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde des paramètres' }, { status: 500 });
  }
}
