import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { serializeUser } from '@/lib/server/serialize';

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);
    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
