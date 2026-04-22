import { connectDatabase } from '../config/db.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

async function seed() {
  await connectDatabase();

  await Promise.all([ActivityLog.deleteMany({}), Task.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin Recruiter',
    email: 'admin@taskforge.local',
    password: 'Password123',
    role: 'admin',
  });

  const user = await User.create({
    name: 'Demo Contributor',
    email: 'user@taskforge.local',
    password: 'Password123',
    role: 'user',
  });

  const tasks = await Task.create([
    {
      title: 'Finalize internship submission',
      description: 'Polish README, auth flow, and audit logs.',
      status: 'in-progress',
      owner: admin._id,
    },
    {
      title: 'Review task CRUD flow',
      description: 'Verify create, edit, filter, and delete actions.',
      status: 'pending',
      owner: user._id,
    },
    {
      title: 'Capture recruiter demo notes',
      description: 'Document how admin and user roles differ.',
      status: 'completed',
      owner: user._id,
    },
  ]);

  await ActivityLog.create([
    {
      actionType: 'task.created',
      actor: admin._id,
      task: tasks[0]._id,
      taskTitleSnapshot: tasks[0].title,
    },
    {
      actionType: 'task.updated',
      actor: user._id,
      task: tasks[2]._id,
      taskTitleSnapshot: tasks[2].title,
    },
  ]);

  console.log('Seed complete.');
  console.log('Admin:', admin.email, 'Password123');
  console.log('User:', user.email, 'Password123');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});
