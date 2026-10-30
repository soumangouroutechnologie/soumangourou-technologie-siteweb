import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(2).max(120),
  company: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().email().max(180),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const contact = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Validation échouée' }, { status: 400 });
  }
}

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
