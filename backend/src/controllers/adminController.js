import { ActivityLog } from '../models/ActivityLog.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createPaginatedResponse, getPagination } from '../utils/pagination.js';
import { escapeRegex } from '../utils/sanitize.js';
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
  const { page, limit, skip } = getPagination(req.validated.query);
  const { search = '', role = '' } = req.validated.query;
  const query = {};

  if (search) {
    const safeSearch = escapeRegex(search);

    query.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } },
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
  const { page, limit, skip } = getPagination(req.validated.query);
  const { search = '', status = '' } = req.validated.query;
  const query = {};

  if (search) {
    const safeSearch = escapeRegex(search);

    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
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
  const { page, limit, skip } = getPagination(req.validated.query);
  const { search = '', actionType = '' } = req.validated.query;

  const query = {};

  if (actionType) {
    query.actionType = actionType;
  }

  if (search) {
    const safeSearch = escapeRegex(search);
    const matchingActors = await User.find({
      $or: [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ],
    }).select('_id');

    query.$or = [
      { taskTitleSnapshot: { $regex: safeSearch, $options: 'i' } },
      { actor: { $in: matchingActors.map((actor) => actor._id) } },
    ];
  }

  const [logs, totalItems] = await Promise.all([
    ActivityLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ActivityLog.countDocuments(query),
  ]);

  res.json(createPaginatedResponse(logs.map(serializeLog), page, limit, totalItems));
});
