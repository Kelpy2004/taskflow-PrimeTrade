export function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function serializeTask(task) {
  const owner = task.owner && typeof task.owner === 'object' ? task.owner : null;

  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    owner: owner
      ? {
          id: owner._id.toString(),
          name: owner.name,
          email: owner.email,
          role: owner.role,
        }
      : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function serializeLog(log) {
  return {
    id: log._id.toString(),
    actionType: log.actionType,
    actor: {
      id: log.actor._id.toString(),
      name: log.actor.name,
      email: log.actor.email,
      role: log.actor.role,
    },
    task: log.task ? log.task.toString() : null,
    taskTitleSnapshot: log.taskTitleSnapshot,
    metadata: log.metadata,
    createdAt: log.createdAt,
  };
}
