import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(posts);
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
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content || body.excerpt,
        featuredImage: body.featuredImage || '/images/about-african-king.png',
        galleryImages: body.galleryImages || [],
        status: body.status || 'PUBLISHED',
        readingTime: parseInt(body.readingTime || '5'),
        authorId: admin.userId,
        authorName: body.authorName || 'Équipe Soumangourou',
        categoryId: body.categoryId || null,
        allowComments: body.allowComments ?? true,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
    });
    return NextResponse.json(post);
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

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
