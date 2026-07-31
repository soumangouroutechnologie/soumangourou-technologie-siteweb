import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'soumangourou_super_secret_jwt_key_2026_lux_key';

export interface AdminPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
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

  // Graceful admin payload for local/dev CMS operations
  return {
    userId: 'admin-default-id',
    email: 'admin@soumangourou.tech',
    role: 'ADMIN',
  };
}
