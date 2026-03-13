import pytest


class TestTaskAPI:
    """Integration tests for Task API endpoints"""

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_create_task_success(self, client):
        """Test creating a task successfully"""
        task_data = {
            "title": "Test Task",
            "description": "Test Description"
        }
        response = client.post("/tasks/", json=task_data)

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["description"] == "Test Description"
        assert data["is_completed"] is False
        assert "id" in data
        assert "created_at" in data

    def test_create_task_validation_error(self, client):
        """Test creating a task with invalid data"""
        # Missing title
        response = client.post("/tasks/", json={"description": "Test"})
        assert response.status_code == 422

        # Empty title
        response = client.post("/tasks/", json={"title": "", "description": "Test"})
        assert response.status_code == 422

        # Missing description
        response = client.post("/tasks/", json={"title": "Test"})
        assert response.status_code == 422

    def test_get_tasks_empty(self, client):
        """Test getting tasks when none exist"""
        response = client.get("/tasks/")

        assert response.status_code == 200
        data = response.json()
        assert data["tasks"] == []
        assert data["total"] == 0

    def test_get_tasks_with_data(self, client):
        """Test getting tasks with data"""
        # Create multiple tasks
        for i in range(7):
            client.post("/tasks/", json={
                "title": f"Task {i}",
                "description": f"Description {i}"
            })

        response = client.get("/tasks/")

        assert response.status_code == 200
        data = response.json()
        assert len(data["tasks"]) == 5  # Only 5 most recent
        assert data["total"] == 7
        assert data["tasks"][0]["title"] == "Task 6"  # Most recent first

    def test_get_tasks_custom_limit(self, client):
        """Test getting tasks with custom limit"""
        # Create tasks
        for i in range(5):
            client.post("/tasks/", json={
                "title": f"Task {i}",
                "description": f"Description {i}"
            })

        response = client.get("/tasks/?limit=3")

        assert response.status_code == 200
        data = response.json()
        assert len(data["tasks"]) == 3

    def test_complete_task_success(self, client):
        """Test completing a task successfully"""
        # Create a task
        create_response = client.post("/tasks/", json={
            "title": "Test Task",
            "description": "Test Description"
        })
        task_id = create_response.json()["id"]

        # Complete the task
        response = client.patch(f"/tasks/{task_id}/complete")

        assert response.status_code == 200
        data = response.json()
        assert data["is_completed"] is True
        assert data["completed_at"] is not None

    def test_complete_task_not_found(self, client):
        """Test completing a non-existent task"""
        response = client.patch("/tasks/999/complete")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_completed_tasks_not_in_list(self, client):
        """Test that completed tasks don't appear in task list"""
        # Create tasks
        for i in range(3):
            client.post("/tasks/", json={
                "title": f"Task {i}",
                "description": f"Description {i}"
            })

        # Complete first task
        client.patch("/tasks/1/complete")

        # Get tasks
        response = client.get("/tasks/")
        data = response.json()

        assert len(data["tasks"]) == 2
        assert all(task["id"] != 1 for task in data["tasks"])

    def test_task_ordering(self, client):
        """Test that tasks are ordered by creation date descending"""
        # Create tasks with slight delay
        task_ids = []
        for i in range(3):
            response = client.post("/tasks/", json={
                "title": f"Task {i}",
                "description": f"Description {i}"
            })
            task_ids.append(response.json()["id"])

        # Get tasks
        response = client.get("/tasks/")
        data = response.json()

        # Most recent should be first
        assert data["tasks"][0]["id"] == task_ids[-1]
        assert data["tasks"][-1]["id"] == task_ids[0]
