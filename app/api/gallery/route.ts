import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { title, caption, imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL requise' }, { status: 400 });
    }

    // Ensure a default gallery exists
    let gallery = await prisma.gallery.findFirst();
    if (!gallery) {
      gallery = await prisma.gallery.create({
        data: {
          title: 'Galerie Principale',
          slug: 'galerie-principale',
        },
      });
    }

    const newImage = await prisma.galleryImage.create({
      data: {
        galleryId: gallery.id,
        imageUrl,
        title,
        caption,
      },
    });

    return NextResponse.json(newImage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
