"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { api } from "@/lib/api";
import { Task, TaskListResponse } from "@/types/task";
import { CheckSquare, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: TaskListResponse = await api.getTasks(PAGE_SIZE, (page - 1) * PAGE_SIZE);
      setTasks(response.tasks);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleCreateTask = async (title: string, description: string) => {
    await api.createTask(title, description);
    if (page !== 1) {
      setPage(1);
      return;
    }
    await fetchTasks();
  };

  const handleCompleteTask = async (taskId: number) => {
    await api.completeTask(taskId);
    const nextTotal = Math.max(total - 1, 0);
    const maxPage = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE));
    if (page > maxPage) {
      setPage(maxPage);
      return;
    }
    await fetchTasks();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return (
    <div className={theme === "dark" ? "min-h-screen bg-[radial-gradient(circle_at_20%_20%,#0f172a_0%,#0b1220_45%,#020617_100%)] px-4 py-8 md:px-8 md:py-12" : "min-h-screen bg-[radial-gradient(circle_at_20%_20%,#f5f7ff_0%,#eef1f7_40%,#e8edf4_100%)] px-4 py-8 md:px-8 md:py-12"}>
      <div className={theme === "dark" ? "mx-auto max-w-7xl rounded-3xl border border-slate-700/80 bg-slate-950/90 p-5 shadow-[0_20px_80px_-40px_rgba(2,6,23,0.8)] backdrop-blur md:p-8 lg:p-10" : "mx-auto max-w-7xl rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur md:p-8 lg:p-10"}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className={theme === "dark" ? "inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold tracking-wide text-slate-200" : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700"}>
              <Sparkles className="h-3.5 w-3.5" />
              Daily Planner
            </div>
            <div className="flex items-center gap-3">
              <CheckSquare className={theme === "dark" ? "h-8 w-8 text-slate-100" : "h-8 w-8 text-slate-900"} />
              <h1 className={theme === "dark" ? "text-3xl font-bold tracking-tight text-slate-100 md:text-4xl" : "text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"}>Todo Tasks</h1>
            </div>
            <p className={theme === "dark" ? "text-sm text-slate-300 md:text-base" : "text-sm text-slate-600 md:text-base"}>Add tasks on the left and complete recent tasks on the right.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={toggleTheme}
              className={theme === "dark" ? "border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className={theme === "dark" ? "rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200" : "rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"}>
              Page {page} of {totalPages}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className={theme === "dark" ? "lg:pr-8 lg:border-r lg:border-slate-700" : "lg:pr-8 lg:border-r lg:border-slate-200"}>
            <TaskForm onSubmit={handleCreateTask} theme={theme} />
          </div>
          <div className="lg:pl-2">
            <TaskList tasks={tasks} onComplete={handleCompleteTask} isLoading={isLoading} theme={theme} />
            <div className="mt-6 flex items-center justify-between gap-3">
              <Button type="button" variant="outline" disabled={!canGoPrev || isLoading} onClick={() => setPage((prev) => prev - 1)}>
                Previous
              </Button>
              <span className={theme === "dark" ? "text-sm font-medium text-slate-300" : "text-sm font-medium text-slate-600"}>
                {total} pending tasks
              </span>
              <Button type="button" variant="outline" disabled={!canGoNext || isLoading} onClick={() => setPage((prev) => prev + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
