import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAdminFromCookies } from '@/lib/auth';

export async function POST(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || '.png';
    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `${Date.now()}-${safeBaseName}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'Erreur d\'upload' }, { status: 500 });
  }
}
