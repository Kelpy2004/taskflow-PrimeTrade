import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/server/auth';
import { ApiError, handleApiError } from '@/lib/server/errors';
import { parseBody, registerSchema } from '@/lib/server/validators';
import { serializeUser } from '@/lib/server/serialize';

export async function POST(req: Request) {
  try {
    const body = await parseBody(req, registerSchema);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new ApiError('An account with this email already exists.', 409);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await hashPassword(body.password),
        role: 'user',
      },
    });

    return NextResponse.json(
      { token: signToken(user.id), user: serializeUser(user) },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
