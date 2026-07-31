import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
