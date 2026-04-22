import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

export async function bootstrapDemoData() {
  const [existingAdmin, existingUser] = await Promise.all([
    User.findOne({ email: 'admin@taskforge.local' }),
    User.findOne({ email: 'user@taskforge.local' }),
  ]);

  const admin =
    existingAdmin ||
    (await User.create({
      name: 'Admin Recruiter',
      email: 'admin@taskforge.local',
      password: 'Password123',
      role: 'admin',
    }));

  const user =
    existingUser ||
    (await User.create({
      name: 'Demo Contributor',
      email: 'user@taskforge.local',
      password: 'Password123',
      role: 'user',
    }));

  const taskCount = await Task.countDocuments();

  if (taskCount > 0) {
    return;
  }

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
}
