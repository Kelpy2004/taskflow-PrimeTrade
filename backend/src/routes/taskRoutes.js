import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from '../controllers/taskController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireObjectId } from '../middlewares/objectId.js';
import { validate } from '../middlewares/validate.js';
import { createTaskSchema, listTasksSchema, updateTaskSchema } from '../validators/taskValidators.js';

const router = Router();

router.use(authenticate);
router.get('/', validate(listTasksSchema), listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', requireObjectId(), getTask);
router.patch('/:id', requireObjectId(), validate(updateTaskSchema), updateTask);
router.delete('/:id', requireObjectId(), deleteTask);

export default router;
