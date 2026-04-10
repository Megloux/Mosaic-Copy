/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseItem } from '@/components/routines/builder/components/ExerciseItem';
import { RoutineExercise } from '@/types/templates';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { layout, whileHover, whileTap, initial, animate, exit, ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Grip: (props: any) => <div data-testid="drag-handle" {...props} />,
  X: (props: any) => <div data-testid="x-icon" {...props} />,
  Info: (props: any) => <div data-testid="info-icon" {...props} />,
  Trash2: (props: any) => <div data-testid="trash-icon" {...props} />
}));

describe('ExerciseItem', () => {
  const mockExercise: RoutineExercise = {
    id: 'ex1',
    name: 'Push-ups',
    sets: 3,
    reps: 10,
    duration: 60,
    tags: ['strength'],
    thumbnailUrl: 'https://example.com/push-ups.jpg',
    isResistance: true
  };

  const defaultProps = {
    exercise: mockExercise,
    onRemove: jest.fn(),
    onInfo: jest.fn(),
    isDraggable: false,
    isEditMode: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the exercise name', () => {
    render(<ExerciseItem {...defaultProps} />);
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
  });

  it('renders duration in MM:SS format', () => {
    render(<ExerciseItem {...defaultProps} />);
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('renders zero duration when duration is 0', () => {
    const exerciseWithZeroDuration = {
      ...mockExercise,
      duration: 0
    };
    render(<ExerciseItem {...defaultProps} exercise={exerciseWithZeroDuration} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('shows info button', () => {
    render(<ExerciseItem {...defaultProps} />);
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('calls onInfo when info button is clicked', () => {
    render(<ExerciseItem {...defaultProps} />);
    const infoButton = screen.getByLabelText('Exercise information');
    fireEvent.click(infoButton);
    expect(defaultProps.onInfo).toHaveBeenCalledTimes(1);
  });

  it('shows drag handle when isDraggable is true', () => {
    render(<ExerciseItem {...defaultProps} isDraggable={true} />);
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
  });

  it('shows remove button and calls onRemove when in edit mode', () => {
    // Render with isEditMode=true to show the remove button
    render(<ExerciseItem {...defaultProps} isEditMode={true} />);
    
    // Now the remove button should be visible
    const removeButton = screen.getByLabelText('Remove exercise');
    expect(removeButton).toBeInTheDocument();
    
    // Test the click handler
    fireEvent.click(removeButton);
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
  });
});
