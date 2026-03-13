"use client";

import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Loader2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: number) => Promise<void>;
  isLoading: boolean;
}

export function TaskList({ tasks, onComplete, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tasks yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={onComplete} />
      ))}
    </div>
  );
}
