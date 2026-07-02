import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { logsQuerySchema, parseQuery } from '@/lib/server/validators';
import { logInclude, paginated, serializeLog } from '@/lib/server/serialize';

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const query = parseQuery(req, logsQuerySchema);

    const where: Prisma.ActivityLogWhereInput = {};
    if (query.actionType) {
      where.actionType = query.actionType;
    }
    if (query.search) {
      where.OR = [
        { taskTitleSnapshot: { contains: query.search, mode: 'insensitive' } },
        { actor: { name: { contains: query.search, mode: 'insensitive' } } },
        { actor: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [logs, totalItems] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: logInclude,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json(paginated(logs.map(serializeLog), query.page, query.limit, totalItems));
  } catch (error) {
    return handleApiError(error);
  }
}
