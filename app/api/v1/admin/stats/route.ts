import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/server/auth';
import { handleApiError } from '@/lib/server/errors';

export async function GET(req: Request) {
  try {
    await requireAdmin(req);

    const [totalUsers, totalTasks, byStatus] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.task.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const count = (status: string) =>
      byStatus.find((row) => row.status === status)?._count._all ?? 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTasks,
        completedTasks: count('completed'),
        pendingTasks: count('pending'),
        inProgressTasks: count('in-progress'),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
