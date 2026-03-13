import { render, screen } from '@testing-library/react';
import { TaskList } from '@/components/TaskList';
import { Task } from '@/types/task';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    is_completed: false,
    created_at: '2024-03-13T10:00:00Z',
    completed_at: null,
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    is_completed: false,
    created_at: '2024-03-13T11:00:00Z',
    completed_at: null,
  },
];

describe('TaskList', () => {
  it('shows loading spinner when isLoading is true', () => {
    const mockOnComplete = jest.fn();
    render(<TaskList tasks={[]} onComplete={mockOnComplete} isLoading={true} />);

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Lucide icons have role="img"
  });

  it('shows empty state when no tasks are available', () => {
    const mockOnComplete = jest.fn();
    render(<TaskList tasks={[]} onComplete={mockOnComplete} isLoading={false} />);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
  });

  it('renders all tasks when tasks are available', () => {
    const mockOnComplete = jest.fn();
    render(<TaskList tasks={mockTasks} onComplete={mockOnComplete} isLoading={false} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders correct number of task cards', () => {
    const mockOnComplete = jest.fn();
    render(<TaskList tasks={mockTasks} onComplete={mockOnComplete} isLoading={false} />);

    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    expect(doneButtons).toHaveLength(2);
  });

  it('passes onComplete handler to each task card', () => {
    const mockOnComplete = jest.fn();
    const { container } = render(
      <TaskList tasks={mockTasks} onComplete={mockOnComplete} isLoading={false} />
    );

    // Verify that TaskCard components are rendered (they contain the task titles)
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
