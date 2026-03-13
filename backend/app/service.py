from sqlalchemy.orm import Session

from app.repository import TaskRepository
from app.schemas import TaskCreate, TaskResponse


class TaskService:
    """Service layer for task business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.repository = TaskRepository()

    def create_task(self, task_data: TaskCreate) -> TaskResponse:
        """Create a new task"""
        task = self.repository.create_task(self.db, task_data)
        return TaskResponse.model_validate(task)

    def get_recent_tasks(self, limit: int = 5, offset: int = 0) -> list[TaskResponse]:
        """Get most recent incomplete tasks"""
        tasks = self.repository.get_recent_tasks(self.db, limit, offset)
        return [TaskResponse.model_validate(task) for task in tasks]

    def complete_task(self, task_id: int) -> TaskResponse | None:
        """Mark a task as completed"""
        task = self.repository.complete_task(self.db, task_id)
        if task:
            return TaskResponse.model_validate(task)
        return None

    def get_task_count(self) -> int:
        """Get count of incomplete tasks"""
        return self.repository.count_incomplete_tasks(self.db)
