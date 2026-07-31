import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { category: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
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
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        summary: body.summary,
        description: body.description || '',
        coverImage: body.coverImage,
        images: body.images || [body.coverImage],
        liveUrl: body.liveUrl,
        githubUrl: body.githubUrl,
        technologies: body.technologies || [],
        isFeatured: body.isFeatured ?? true,
        order: body.order ?? 0,
        categoryId: body.categoryId || null,
      },
    });
    return NextResponse.json(project);
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

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
