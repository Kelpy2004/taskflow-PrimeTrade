import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: ['task.created', 'task.updated', 'task.deleted'],
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    taskTitleSnapshot: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
