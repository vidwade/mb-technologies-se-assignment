import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '@/components/TaskForm';

describe('TaskForm', () => {
  it('renders form with title and description inputs', () => {
    const mockOnSubmit = jest.fn();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    const mockOnSubmit = jest.fn();
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/both title and description are required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form data when valid', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test Task', 'Test Description');
    });
  });

  it('clears form after successful submission', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  it('shows error message when submission fails', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('API Error'));
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
    });
  });

  it('disables form during submission', async () => {
    const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(titleInput).toBeDisabled();
    expect(descriptionInput).toBeDisabled();
    expect(screen.getByText(/creating.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
