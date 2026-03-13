import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

type HTTPValidationError = Partial<{
  detail: Array<ValidationError>;
}>;
type ValidationError = {
  ctx?: {} | undefined;
  input?: unknown | undefined;
  loc: Array<(string | number) | Array<string | number>>;
  msg: string;
  type: string;
};
type TaskListResponse = {
  tasks: Array<TaskResponse>;
  total: number;
};
type TaskResponse = {
  completed_at?: ((string | null) | Array<string | null>) | undefined;
  created_at: string;
  description: string;
  id: number;
  is_completed: boolean;
  title: string;
};

const TaskResponse: z.ZodType<TaskResponse> = z
  .object({
    completed_at: z.union([z.string(), z.null()]).optional(),
    created_at: z.string().datetime({ offset: true }),
    description: z.string().min(1),
    id: z.number().int(),
    is_completed: z.boolean(),
    title: z.string().min(1).max(255),
  })
  .passthrough();
const TaskListResponse: z.ZodType<TaskListResponse> = z
  .object({ tasks: z.array(TaskResponse), total: z.number().int() })
  .passthrough();
const ValidationError: z.ZodType<ValidationError> = z
  .object({
    ctx: z.object({}).partial().passthrough().optional(),
    input: z.unknown().optional(),
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string(),
  })
  .passthrough();
const HTTPValidationError: z.ZodType<HTTPValidationError> = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();
const TaskCreate = z
  .object({ description: z.string().min(1), title: z.string().min(1).max(255) })
  .passthrough();

export const schemas = {
  TaskResponse,
  TaskListResponse,
  ValidationError,
  HTTPValidationError,
  TaskCreate,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/tasks/",
    alias: "getTasks",
    description: `Get most recent incomplete tasks`,
    requestFormat: "json",
    parameters: [
      {
        name: "limit",
        type: "Query",
        schema: z.number().int().gte(1).lte(100).optional().default(5),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().gte(0).optional().default(0),
      },
    ],
    response: TaskListResponse,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/tasks/",
    alias: "createTask",
    description: `Create a new task`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: TaskCreate,
      },
    ],
    response: TaskResponse,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "patch",
    path: "/tasks/:task_id/complete",
    alias: "completeTask",
    description: `Mark a task as completed`,
    requestFormat: "json",
    parameters: [
      {
        name: "task_id",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: TaskResponse,
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
