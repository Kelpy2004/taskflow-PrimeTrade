import { Task } from '../models/Task.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logActivity } from '../utils/logActivity.js';
import { createPaginatedResponse, getPagination } from '../utils/pagination.js';
import { serializeTask } from '../utils/serialize.js';
import { sanitizeText } from '../utils/sanitize.js';

function buildTaskQuery(user, search, status) {
  const query = {};

  if (user.role !== 'admin') {
    query.owner = user._id;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    query.status = status;
  }

  return query;
}

async function findTaskForUser(taskId, user) {
  const task = await Task.findById(taskId).populate('owner', 'name email role');

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role !== 'admin' && task.owner._id.toString() !== user._id.toString()) {
    throw new AppError('You do not have permission to access this task.', 403);
  }

  return task;
}

export const listTasks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search = '', status = '' } = req.query;
  const query = buildTaskQuery(req.user, search, status);

  const [tasks, totalItems] = await Promise.all([
    Task.find(query)
      .populate('owner', 'name email role')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(query),
  ]);

  res.json(createPaginatedResponse(tasks.map(serializeTask), page, limit, totalItems));
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    title: sanitizeText(req.validated.body.title),
    description: sanitizeText(req.validated.body.description || ''),
    status: req.validated.body.status,
    owner: req.user._id,
  });

  await logActivity({
    actionType: 'task.created',
    actorId: req.user._id,
    taskId: task._id,
    taskTitleSnapshot: task.title,
  });

  const populatedTask = await task.populate('owner', 'name email role');

  res.status(201).json({
    message: 'Task created successfully.',
    task: serializeTask(populatedTask),
  });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await findTaskForUser(req.params.id, req.user);

  res.json({ task: serializeTask(task) });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await findTaskForUser(req.params.id, req.user);

  task.title = sanitizeText(req.validated.body.title);
  task.description = sanitizeText(req.validated.body.description || '');
  task.status = req.validated.body.status;
  await task.save();

  await logActivity({
    actionType: 'task.updated',
    actorId: req.user._id,
    taskId: task._id,
    taskTitleSnapshot: task.title,
  });

  await task.populate('owner', 'name email role');

  res.json({
    message: 'Task updated successfully.',
    task: serializeTask(task),
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findTaskForUser(req.params.id, req.user);

  await Task.findByIdAndDelete(task._id);

  await logActivity({
    actionType: 'task.deleted',
    actorId: req.user._id,
    taskId: task._id,
    taskTitleSnapshot: task.title,
    metadata: {
      deletedOwnerId: task.owner._id.toString(),
    },
  });

  res.json({ message: 'Task deleted successfully.' });
});
