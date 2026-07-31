import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
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
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
