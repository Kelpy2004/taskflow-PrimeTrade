import type { TaskStatus } from '@/types';

export const STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed'];

/** Per-status palette: lightened text, translucent background, soft border. */
export const STATUS_META: Record<
  TaskStatus,
  { label: string; sub: string; color: string; text: string; bg: string; border: string }
> = {
  pending: {
    label: 'To Do',
    sub: 'queued',
    color: '#8aa6c8',
    text: '#b4cae0',
    bg: 'rgba(138,166,200,0.12)',
    border: 'rgba(138,166,200,0.3)',
  },
  'in-progress': {
    label: 'In Progress',
    sub: 'building',
    color: '#b98cf0',
    text: '#d8b6f8',
    bg: 'rgba(185,140,240,0.13)',
    border: 'rgba(185,140,240,0.32)',
  },
  completed: {
    label: 'Done',
    sub: 'shipped',
    color: '#4fe0b0',
    text: '#79ecc4',
    bg: 'rgba(79,224,176,0.13)',
    border: 'rgba(79,224,176,0.32)',
  },
};
