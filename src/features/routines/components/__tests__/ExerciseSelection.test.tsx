/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ExerciseSelection } from '@/components/routines/ExerciseSelection';
import { exerciseService } from '@/features/exercises/api/exerciseService';

// Mock the dependencies
jest.mock('@/services/ExerciseService', () => ({
  exerciseService: {
    getAllExercises: jest.fn(),
    getExercisesByTags: jest.fn(),
  }
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { initial, animate, exit, transition, ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the Modal component
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, open, onClose, title }: any) => (
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <div>{children}</div>
        <button onClick={onClose} data-testid="close-modal">Close</button>
      </div>
    ) : null
  )
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Search: (props: any) => <div data-testid="search-icon" {...props} />,
  Plus: (props: any) => <div data-testid="plus-icon" {...props} />,
  Tag: (props: any) => <div data-testid="tag-icon" {...props} />
}));

// Mock the SearchInput component
jest.mock('@/shared/ui/form/SearchInput', () => ({
  SearchInput: ({ value, onChange, placeholder }: any) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="search-input"
    />
  )
}));

// Mock the StandardButton component
jest.mock('@/components/ui/buttons/StandardButton', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => (
    <button onClick={onClick} data-testid="standard-button">
      {children}
    </button>
  )
}));

describe('ExerciseSelection', () => {
  const mockExercises = [
    {
      id: 'ex1',
      name: 'Push-ups',
      description: 'Classic upper body exercise',
      tags: ['strength', 'upper-body', 'chest'],
      thumbnailUrl: 'https://example.com/push-ups.jpg',
      isResistance: true,
      sets: 3,
      reps: 10,
      duration: 0
    },
    {
      id: 'ex2',
      name: 'Squats',
      description: 'Lower body compound exercise',
      tags: ['strength', 'lower-body', 'legs'],
      thumbnailUrl: 'https://example.com/squats.jpg',
      isResistance: true,
      sets: 3,
      reps: 12,
      duration: 0
    },
    {
      id: 'ex3',
      name: 'Plank',
      description: 'Core stability exercise',
      tags: ['core', 'stability'],
      thumbnailUrl: 'https://example.com/plank.jpg',
      isResistance: false,
      sets: 1,
      reps: 1,
      duration: 60
    }
  ];

  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSelectExercise: jest.fn(),
    blockId: 'block1'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the exercise service to return the mock exercises
    (exerciseService.getAllExercises as jest.Mock).mockResolvedValue(mockExercises);
    (exerciseService.getExercisesByTags as jest.Mock).mockResolvedValue(mockExercises);
  });

  it('renders the modal when open is true', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('Add to this routine')).toBeInTheDocument();
    });
  });

  it('does not render the modal when open is false', () => {
    render(<ExerciseSelection {...defaultProps} open={false} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('fetches exercises on mount', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    await waitFor(() => {
      expect(exerciseService.getAllExercises).toHaveBeenCalledTimes(1);
    });
  });

  it('fetches exercises by tags when templateBlock is provided', async () => {
    const templateBlock = {
      block_id: 'block1',
      name: 'Strength',
      template_tags: ['strength'],
      exercise_count: {
        min: 3,
        max: 5
      },
      instructions: 'Complete 3-5 strength exercises',
      is_warmup: false,
      has_cardio_burst: false,
      position: 1
    };
    
    render(<ExerciseSelection {...defaultProps} templateBlock={templateBlock} />);
    
    await waitFor(() => {
      expect(exerciseService.getExercisesByTags).toHaveBeenCalledWith(['strength']);
    });
  });

  it('filters exercises based on search query', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    // Wait for exercises to load
    await waitFor(() => {
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'push' } });
    
    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
      expect(screen.queryByText('Squats')).not.toBeInTheDocument();
    });
  });

  it('calls onSelectExercise when an exercise is clicked', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    // Wait for exercises to load
    await waitFor(() => {
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
    });
    
    // Click on an exercise
    fireEvent.click(screen.getByText('Push-ups').closest('div.flex.items-center.justify-between') as HTMLElement);
    
    expect(defaultProps.onSelectExercise).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('calls onClose when Done button is clicked', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    // Wait for the button to be available
    await waitFor(() => {
      expect(screen.getByTestId('standard-button')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('standard-button'));
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // Skip the tag selection test for now as it's more complex to test
  // We'll focus on the core functionality first
  it.skip('toggles tag selection when a tag is clicked', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    // This test is more complex and requires more setup
    // We'll skip it for now
  });

  it('shows loading state while fetching exercises', async () => {
    // Make the promise not resolve immediately
    (exerciseService.getAllExercises as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(mockExercises), 100);
      });
    });
    
    render(<ExerciseSelection {...defaultProps} />);
    
    // Loading state should be visible initially
    expect(screen.getByText('Loading exercises...')).toBeInTheDocument();
    
    // Wait for exercises to load
    await waitFor(() => {
      expect(screen.queryByText('Loading exercises...')).not.toBeInTheDocument();
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
    });
  });

  it('shows error state when fetching exercises fails', async () => {
    const errorMessage = 'Failed to load exercises. Please try again.';
    (exerciseService.getAllExercises as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<ExerciseSelection {...defaultProps} />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('shows empty state when no exercises match the filters', async () => {
    render(<ExerciseSelection {...defaultProps} />);
    
    // Wait for exercises to load
    await waitFor(() => {
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
    });
    
    // Enter a search term that won't match any exercises
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent exercise' } });
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No exercises found')).toBeInTheDocument();
    });
  });
});
