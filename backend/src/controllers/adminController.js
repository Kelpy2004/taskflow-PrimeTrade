import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createPaginatedResponse, getPagination } from '../utils/pagination.js';
import { serializeLog, serializeTask, serializeUser } from '../utils/serialize.js';

export const getStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: 'completed' }),
    Task.countDocuments({ status: 'pending' }),
    Task.countDocuments({ status: 'in-progress' }),
  ]);

  res.json({
    stats: {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    },
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search = '', role = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const [users, totalItems] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  res.json(createPaginatedResponse(users.map(serializeUser), page, limit, totalItems));
});

export const listAllTasks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search = '', status = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    query.status = status;
  }

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

export const listLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search = '', actionType = '' } = req.query;

  const query = {};

  if (actionType) {
    query.actionType = actionType;
  }

  if (search) {
    query.$or = [{ taskTitleSnapshot: { $regex: search, $options: 'i' } }];
  }

  const logs = await ActivityLog.find(query)
    .populate('actor', 'name email role')
    .sort({ createdAt: -1 });

  const normalizedSearch = search.toLowerCase();
  const filteredLogs = search
    ? logs.filter(
        (log) =>
          log.actor.name.toLowerCase().includes(normalizedSearch) ||
          log.actor.email.toLowerCase().includes(normalizedSearch) ||
          log.taskTitleSnapshot.toLowerCase().includes(normalizedSearch),
      )
    : logs;

  const paginatedLogs = filteredLogs.slice(skip, skip + limit);

  res.json(createPaginatedResponse(paginatedLogs.map(serializeLog), page, limit, filteredLogs.length));
});
