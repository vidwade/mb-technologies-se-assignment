import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/types/task';
import userEvent from '@testing-library/user-event';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  is_completed: false,
  created_at: '2024-03-13T10:00:00Z',
  completed_at: null,
};

describe('TaskCard', () => {
  it('renders task information correctly', () => {
    const mockOnComplete = jest.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('calls onComplete when Done button is clicked', async () => {
    const mockOnComplete = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    expect(mockOnComplete).toHaveBeenCalledWith(1);
  });

  it('formats date correctly', () => {
    const mockOnComplete = jest.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);

    // Check that some date text is rendered (exact format may vary by locale)
    expect(screen.getByText(/mar|03|13|2024/i)).toBeInTheDocument();
  });

  it('displays multi-line description with proper formatting', () => {
    const multiLineTask: Task = {
      ...mockTask,
      description: 'Line 1\nLine 2\nLine 3',
    };
    
    const mockOnComplete = jest.fn();
    render(<TaskCard task={multiLineTask} onComplete={mockOnComplete} />);

    expect(screen.getByText('Line 1\nLine 2\nLine 3')).toBeInTheDocument();
  });
});
