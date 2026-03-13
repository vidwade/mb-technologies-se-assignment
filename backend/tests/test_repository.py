import pytest
from datetime import datetime

from app.models import Task
from app.repository import TaskRepository
from app.schemas import TaskCreate


class TestTaskRepository:
    """Unit tests for TaskRepository"""

    def test_create_task(self, db_session):
        """Test creating a new task"""
        task_data = TaskCreate(title="Test Task", description="Test Description")
        task = TaskRepository.create_task(db_session, task_data)

        assert task.id is not None
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.is_completed is False
        assert task.created_at is not None
        assert task.completed_at is None

    def test_get_recent_tasks(self, db_session):
        """Test getting recent incomplete tasks"""
        # Create multiple tasks
        for i in range(7):
            task_data = TaskCreate(title=f"Task {i}", description=f"Description {i}")
            TaskRepository.create_task(db_session, task_data)

        # Get only 5 most recent
        tasks = TaskRepository.get_recent_tasks(db_session, limit=5)

        assert len(tasks) == 5
        assert tasks[0].title == "Task 6"  # Most recent
        assert all(not task.is_completed for task in tasks)

    def test_get_recent_tasks_excludes_completed(self, db_session):
        """Test that completed tasks are not returned"""
        # Create tasks
        task_data1 = TaskCreate(title="Task 1", description="Description 1")
        task1 = TaskRepository.create_task(db_session, task_data1)
        
        task_data2 = TaskCreate(title="Task 2", description="Description 2")
        TaskRepository.create_task(db_session, task_data2)

        # Complete first task
        TaskRepository.complete_task(db_session, task1.id)

        # Get recent tasks
        tasks = TaskRepository.get_recent_tasks(db_session, limit=5)

        assert len(tasks) == 1
        assert tasks[0].title == "Task 2"

    def test_get_task_by_id(self, db_session):
        """Test getting a task by ID"""
        task_data = TaskCreate(title="Test Task", description="Test Description")
        created_task = TaskRepository.create_task(db_session, task_data)

        retrieved_task = TaskRepository.get_task_by_id(db_session, created_task.id)

        assert retrieved_task is not None
        assert retrieved_task.id == created_task.id
        assert retrieved_task.title == "Test Task"

    def test_get_task_by_id_not_found(self, db_session):
        """Test getting a non-existent task"""
        task = TaskRepository.get_task_by_id(db_session, 999)
        assert task is None

    def test_complete_task(self, db_session):
        """Test marking a task as completed"""
        task_data = TaskCreate(title="Test Task", description="Test Description")
        created_task = TaskRepository.create_task(db_session, task_data)

        completed_task = TaskRepository.complete_task(db_session, created_task.id)

        assert completed_task is not None
        assert completed_task.is_completed is True
        assert completed_task.completed_at is not None
        assert isinstance(completed_task.completed_at, datetime)

    def test_complete_task_not_found(self, db_session):
        """Test completing a non-existent task"""
        task = TaskRepository.complete_task(db_session, 999)
        assert task is None

    def test_count_incomplete_tasks(self, db_session):
        """Test counting incomplete tasks"""
        # Create multiple tasks
        for i in range(5):
            task_data = TaskCreate(title=f"Task {i}", description=f"Description {i}")
            TaskRepository.create_task(db_session, task_data)

        # Complete 2 tasks
        TaskRepository.complete_task(db_session, 1)
        TaskRepository.complete_task(db_session, 2)

        count = TaskRepository.count_incomplete_tasks(db_session)
        assert count == 3
