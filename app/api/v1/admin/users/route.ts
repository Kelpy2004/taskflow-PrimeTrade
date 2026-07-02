import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { parseQuery, usersQuerySchema } from '@/lib/server/validators';
import { paginated, serializeUser } from '@/lib/server/serialize';

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const query = parseQuery(req, usersQuerySchema);

    const where: Prisma.UserWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.role) {
      where.role = query.role;
    }

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { _count: { select: { tasks: true } } },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      paginated(
        users.map((user) => ({ ...serializeUser(user), taskCount: user._count.tasks })),
        query.page,
        query.limit,
        totalItems,
      ),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
