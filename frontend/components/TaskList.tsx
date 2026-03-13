"use client";

import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Loader2 } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: number) => Promise<void>;
  isLoading: boolean;
  theme?: "light" | "dark";
}

export function TaskList({ tasks, onComplete, isLoading, theme = "light" }: TaskListProps) {
  if (isLoading) {
    return (
      <div className={theme === "dark" ? "flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 py-16" : "flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16"}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={theme === "dark" ? "rounded-2xl border border-dashed border-slate-600 bg-slate-900 px-6 py-16 text-center" : "rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center"}>
        <p className={theme === "dark" ? "text-lg font-semibold text-slate-200" : "text-lg font-semibold text-slate-700"}>No tasks yet</p>
        <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={onComplete} theme={theme} />
      ))}
    </div>
  );
}
