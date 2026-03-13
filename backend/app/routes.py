from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import TaskCreate, TaskResponse, TaskListResponse
from app.service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createTask",
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    """Create a new task"""
    service = TaskService(db)
    return service.create_task(task_data)


@router.get("/", response_model=TaskListResponse, operation_id="getTasks")
def get_tasks(
    limit: int = 5,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get most recent incomplete tasks"""
    service = TaskService(db)
    tasks = service.get_recent_tasks(limit, offset)
    total = service.get_task_count()
    return TaskListResponse(tasks=tasks, total=total)


@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse,
    operation_id="completeTask",
)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """Mark a task as completed"""
    service = TaskService(db)
    task = service.complete_task(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    return task
