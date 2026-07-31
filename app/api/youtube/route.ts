import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const videos = await prisma.youtubeVideo.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { title, youtubeId, description, isPlaylist } = await request.json();
    const video = await prisma.youtubeVideo.create({
      data: {
        title,
        youtubeId,
        description,
        isPlaylist: isPlaylist ?? false,
      },
    });
    return NextResponse.json(video);
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

    await prisma.youtubeVideo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
