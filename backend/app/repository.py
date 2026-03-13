from datetime import datetime
from typing import List

from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models import Task
from app.schemas import TaskCreate


class TaskRepository:
    """Repository for Task database operations"""

    @staticmethod
    def create_task(db: Session, task_data: TaskCreate) -> Task:
        """Create a new task"""
        task = Task(
            title=task_data.title,
            description=task_data.description
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_recent_tasks(db: Session, limit: int = 5) -> List[Task]:
        """Get most recent incomplete tasks"""
        return (
            db.query(Task)
            .filter(Task.is_completed == False)
            .order_by(desc(Task.created_at))
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_task_by_id(db: Session, task_id: int) -> Task | None:
        """Get a task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()

    @staticmethod
    def complete_task(db: Session, task_id: int) -> Task | None:
        """Mark a task as completed"""
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.is_completed = True
            task.completed_at = datetime.utcnow()
            db.commit()
            db.refresh(task)
        return task

    @staticmethod
    def count_incomplete_tasks(db: Session) -> int:
        """Count total incomplete tasks"""
        return db.query(Task).filter(Task.is_completed == False).count()
