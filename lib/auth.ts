import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { cookies } from 'next/headers';

function getJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
    return process.env.JWT_SECRET;
  }
  const seed =
    process.env.JWT_SECRET ||
    process.env.DATABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'soumangourou-cms-fallback-seed';
  return crypto.createHash('sha256').update(seed).digest('hex');
}

export interface AdminPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (token) {
      const verified = verifyAdminToken(token);
      if (verified) return verified;
    }
  } catch (e) {
    console.error('Cookie verification error:', e);
  }

  return null;
}
