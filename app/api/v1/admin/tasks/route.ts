import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { listQuerySchema, parseQuery } from '@/lib/server/validators';
import { paginated, serializeTask, taskInclude } from '@/lib/server/serialize';
import { buildTaskWhere } from '@/lib/server/tasks';

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const query = parseQuery(req, listQuerySchema);
    // null user = no owner scoping (admin sees everything).
    const where = buildTaskWhere(null, query.search, query.status);

    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: { updatedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json(paginated(tasks.map(serializeTask), query.page, query.limit, totalItems));
  } catch (error) {
    return handleApiError(error);
  }
}
