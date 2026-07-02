import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { createTaskSchema, listQuerySchema, parseBody, parseQuery } from '@/lib/server/validators';
import { paginated, serializeTask, taskInclude } from '@/lib/server/serialize';
import { buildTaskWhere } from '@/lib/server/tasks';
import { logActivity } from '@/lib/server/activity';

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);
    const query = parseQuery(req, listQuerySchema);
    const where = buildTaskWhere(user, query.search, query.status);

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

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req);
    const body = await parseBody(req, createTaskSchema);

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        ownerId: user.id,
      },
      include: taskInclude,
    });

    await logActivity({
      actionType: 'task.created',
      actorId: user.id,
      taskId: task.id,
      taskTitleSnapshot: task.title,
    });

    return NextResponse.json(
      { message: 'Task created successfully.', task: serializeTask(task) },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
