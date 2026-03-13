export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface TaskCreate {
  title: string;
  description: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}
