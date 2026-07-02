/* Demo seed: admin + member accounts and a realistic task board with audit history. */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const DEMO_PASSWORD = 'Password123';

const TASKS = [
  { title: 'Design the Kanban board', description: 'Columns for To Do, In Progress and Done with drag-and-drop.', status: 'completed', owner: 'admin' },
  { title: 'Wire Redux optimistic moves', description: 'Card jumps instantly, PATCH in background, undo toast on success.', status: 'completed', owner: 'admin' },
  { title: 'Audit onboarding copy', description: 'Review empty states and error messages for tone.', status: 'pending', owner: 'user' },
  { title: 'Ship auth flow', description: 'JWT sign-in, registration and protected routes.', status: 'completed', owner: 'user' },
  { title: 'Build glass task cards', description: 'Default, hover, dragging, drop-target and ghost states.', status: 'in-progress', owner: 'admin' },
  { title: 'Polish mobile navigation', description: 'Drawer plus bottom tabs; status dropdown as the drag fallback.', status: 'in-progress', owner: 'user' },
  { title: 'Draft release notes', description: 'Summarize the Postgres + Redux migration for the README.', status: 'pending', owner: 'user' },
  { title: 'Verify empty states', description: 'Each column and table needs its own empty illustration.', status: 'pending', owner: 'admin' },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskforge.local' },
    update: {},
    create: { name: 'Maria Rodrigues', email: 'admin@taskforge.local', password: passwordHash, role: 'admin' },
  });

  const member = await prisma.user.upsert({
    where: { email: 'user@taskforge.local' },
    update: {},
    create: { name: 'Alex Kim', email: 'user@taskforge.local', password: passwordHash, role: 'user' },
  });

  const owners = { admin: admin.id, user: member.id };

  const taskCount = await prisma.task.count();
  if (taskCount > 0) {
    console.log('Tasks already present — skipping task seed.');
    return;
  }

  for (const seed of TASKS) {
    const task = await prisma.task.create({
      data: {
        title: seed.title,
        description: seed.description,
        status: seed.status,
        ownerId: owners[seed.owner],
      },
    });

    await prisma.activityLog.create({
      data: {
        actionType: 'task.created',
        actorId: owners[seed.owner],
        taskId: task.id,
        taskTitleSnapshot: task.title,
      },
    });

    if (seed.status !== 'pending') {
      await prisma.activityLog.create({
        data: {
          actionType: 'task.updated',
          actorId: owners[seed.owner],
          taskId: task.id,
          taskTitleSnapshot: task.title,
          metadata: { from: 'pending', to: seed.status },
        },
      });
    }
  }

  console.log('Seed complete: admin@taskforge.local / user@taskforge.local — password:', DEMO_PASSWORD);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
