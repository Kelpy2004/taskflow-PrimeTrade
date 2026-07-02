import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/server/auth';
import { ApiError, handleApiError } from '@/lib/server/errors';
import { loginSchema, parseBody } from '@/lib/server/validators';
import { serializeUser } from '@/lib/server/serialize';

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, loginSchema);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await comparePassword(body.password, user.password))) {
      throw new ApiError('Invalid email or password.', 401);
    }

    return NextResponse.json({ token: signToken(user.id), user: serializeUser(user) });
  } catch (error) {
    return handleApiError(error);
  }
}
