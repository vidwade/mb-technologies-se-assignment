const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
import { schemas } from '@/lib/generated/api-client';
import { ZodType } from 'zod';

const parseApiResponse = async <T>(response: Response, schema: ZodType<T>, errorMessage: string): Promise<T> => {
  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(`${errorMessage} (status: ${response.status})`);
  }

  if (response.status === 204 || response.status === 205 || rawBody.length === 0) {
    throw new Error(`Invalid API response for ${response.url}: empty response body`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Invalid API response for ${response.url}: expected application/json, got ${contentType}`);
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(rawBody);
  } catch {
    throw new Error(`Invalid API response for ${response.url}: body is not valid JSON`);
  }

  try {
    return schema.parse(jsonBody);
  } catch {
    throw new Error(`Invalid API response for ${response.url}: schema validation failed`);
  }
};

export const api = {
  async getTasks(limit = 5, offset = 0) {
    const response = await fetch(`${API_BASE_URL}/tasks/?limit=${limit}&offset=${offset}`);
    return parseApiResponse(response, schemas.TaskListResponse, 'Failed to fetch tasks');
  },

  async createTask(title: string, description: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    return parseApiResponse(response, schemas.TaskResponse, 'Failed to create task');
  },

  async completeTask(taskId: number) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
    return parseApiResponse(response, schemas.TaskResponse, 'Failed to complete task');
  },
};
