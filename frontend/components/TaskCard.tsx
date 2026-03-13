"use client";

import { Task } from "@/types/task";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
  theme?: "light" | "dark";
}

export function TaskCard({ task, onComplete, theme = "light" }: TaskCardProps) {
  const handleComplete = async () => {
    await onComplete(task.id);
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className={theme === "dark" ? "rounded-2xl border-slate-700 bg-slate-800/80 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md" : "rounded-2xl border-slate-200 bg-slate-100/80 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"}>
      <CardHeader className="pb-3">
        <CardTitle className={theme === "dark" ? "text-2xl font-bold tracking-tight text-slate-100" : "text-2xl font-bold tracking-tight text-slate-900"}>{task.title}</CardTitle>
        <CardDescription className={theme === "dark" ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className={theme === "dark" ? "whitespace-pre-wrap text-base leading-relaxed text-slate-300" : "whitespace-pre-wrap text-base leading-relaxed text-slate-700"}>
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={handleComplete}
          variant="outline"
          className={theme === "dark" ? "w-full border-slate-500 bg-slate-900 font-semibold text-slate-200 transition hover:border-slate-300 hover:bg-slate-700" : "w-full border-slate-400 bg-white font-semibold text-slate-700 transition hover:border-slate-600 hover:bg-slate-50"}
          size="sm"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Done
        </Button>
      </CardFooter>
    </Card>
  );
}
