import { Router } from 'express';
import {
  getStats,
  listAllTasks,
  listLogs,
  listUsers,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listLogsSchema, listUsersSchema } from '../validators/adminValidators.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', validate(listUsersSchema), listUsers);
router.get('/tasks', listAllTasks);
router.get('/logs', validate(listLogsSchema), listLogs);

export default router;
