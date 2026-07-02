import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';
import { parseBody, updateTaskSchema } from '@/lib/server/validators';
import { serializeTask, taskInclude } from '@/lib/server/serialize';
import { findTaskForUser } from '@/lib/server/tasks';
import { logActivity } from '@/lib/server/activity';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const task = await findTaskForUser(id, user);
    return NextResponse.json({ task: serializeTask(task) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const existing = await findTaskForUser(id, user);
    const body = await parseBody(req, updateTaskSchema);

    const task = await prisma.task.update({
      where: { id: existing.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
      include: taskInclude,
    });

    await logActivity({
      actionType: 'task.updated',
      actorId: user.id,
      taskId: task.id,
      taskTitleSnapshot: task.title,
      metadata:
        body.status !== undefined && body.status !== existing.status
          ? { from: existing.status, to: body.status }
          : undefined,
    });

    return NextResponse.json({ message: 'Task updated successfully.', task: serializeTask(task) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;
    const task = await findTaskForUser(id, user);

    await prisma.task.delete({ where: { id: task.id } });

    await logActivity({
      actionType: 'task.deleted',
      actorId: user.id,
      taskTitleSnapshot: task.title,
      metadata: { deletedOwnerId: task.ownerId },
    });

    return NextResponse.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    return handleApiError(error);
  }
}
