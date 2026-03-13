import { z } from 'zod';

import { schemas } from '@/lib/generated/api-client';

export type Task = z.infer<typeof schemas.TaskResponse>;
export type TaskCreate = z.infer<typeof schemas.TaskCreate>;
export type TaskListResponse = z.infer<typeof schemas.TaskListResponse>;
