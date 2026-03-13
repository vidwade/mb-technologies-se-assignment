"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { api } from "@/lib/api";
import { Task, TaskListResponse } from "@/types/task";
import { CheckSquare } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: TaskListResponse = await api.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (title: string, description: string) => {
    await api.createTask(title, description);
    await fetchTasks();
  };

  const handleCompleteTask = async (taskId: number) => {
    await api.completeTask(taskId);
    await fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckSquare className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Todo Tasks</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your tasks efficiently
          </p>
        </div>

        {/* Task Form */}
        <div className="mb-8 max-w-2xl mx-auto">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Tasks
          </h2>
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
