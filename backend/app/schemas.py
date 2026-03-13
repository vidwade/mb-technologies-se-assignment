from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    """Base schema for Task"""
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: str = Field(..., min_length=1, description="Task description")


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass


class TaskResponse(TaskBase):
    """Schema for task response"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None


class TaskListResponse(BaseModel):
    """Schema for list of tasks response"""
    tasks: list[TaskResponse]
    total: int
