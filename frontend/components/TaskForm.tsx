"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface TaskFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  theme?: "light" | "dark";
}

export function TaskForm({ onSubmit, theme = "light" }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError("Both title and description are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(title, description);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={theme === "dark" ? "border-slate-700 bg-slate-900 shadow-sm" : "border-slate-200 bg-white shadow-sm"}>
      <CardHeader className="pb-4">
        <CardTitle className={theme === "dark" ? "text-2xl font-bold tracking-tight text-slate-100" : "text-2xl font-bold tracking-tight text-slate-900"}>Add a Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className={theme === "dark" ? "text-sm font-semibold text-slate-300" : "text-sm font-semibold text-slate-700"}>
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className={theme === "dark" ? "h-11 border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-500" : "h-11 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-300"}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className={theme === "dark" ? "text-sm font-semibold text-slate-300" : "text-sm font-semibold text-slate-700"}>
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className={theme === "dark" ? "min-h-32 resize-none border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-500" : "min-h-32 resize-none border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-300"}
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
