import { NextResponse } from 'next/server';
import { getAdminFromCookies } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  return createClient(supabaseUrl, supabaseKey);
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (maximum 5 Mo)' },
        { status: 400 }
      );
    }

    const ext = (path.extname(file.name) || '.png').toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Format de fichier non autorisé (JPG, PNG, WEBP, GIF, AVIF uniquement)' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const safeBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `${Date.now()}-${safeBaseName}${ext}`;

    // Upload to Supabase Storage
    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filename, buffer, {
        contentType: file.type || 'image/png',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message);
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrlData.publicUrl, success: true });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || "Erreur d'upload" }, { status: 500 });
  }
}
