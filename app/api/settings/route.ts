import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [settings, seoSettings] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 'default' } }),
      prisma.seoSettings.findUnique({ where: { id: 'default' } }),
    ]);

    return NextResponse.json({ settings, seoSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des paramètres' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
