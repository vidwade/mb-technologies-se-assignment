"use client";

import { Task } from "@/types/task";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => Promise<void>;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {task.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleComplete}
          variant="default"
          className="w-full"
          size="sm"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Done
        </Button>
      </CardFooter>
    </Card>
  );
}
