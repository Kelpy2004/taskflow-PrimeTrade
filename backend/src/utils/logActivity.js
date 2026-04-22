import { ActivityLog } from '../models/ActivityLog.js';

export async function logActivity({ actionType, actorId, taskId = null, taskTitleSnapshot, metadata = {} }) {
  await ActivityLog.create({
    actionType,
    actor: actorId,
    task: taskId,
    taskTitleSnapshot,
    metadata,
  });
}
