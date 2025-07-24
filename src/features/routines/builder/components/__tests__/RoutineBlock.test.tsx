/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutineBlock } from '@/components/routines/builder/components/RoutineBlock';
import { RoutineBlock as RoutineBlockType, RoutineExercise } from '@/features/routines/model/types';

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
  Reorder: {
    Group: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { values, onReorder, axis, ...validProps } = props;
      return <div data-testid="reorder-group" {...validProps}>{children}</div>;
    },
    Item: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { value, ...validProps } = props;
      return <div data-testid="reorder-item" {...validProps}>{children}</div>;
    },
  },
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <div data-testid="chevron-down" {...props} />,
  ChevronUp: (props: any) => <div data-testid="chevron-up" {...props} />,
  Plus: (props: any) => <div data-testid="plus-icon" {...props} />,
  Grip: (props: any) => <div data-testid="drag-handle" {...props} />,
  X: (props: any) => <div data-testid="x-icon" {...props} />,
  Info: (props: any) => <div data-testid="info-icon" {...props} />
}));

// Mock the ExerciseItem component
jest.mock('../components/ExerciseItem', () => ({
  ExerciseItem: ({ exercise, onRemove, onInfo, isDraggable }: any) => (
    <div data-testid={`exercise-${exercise.id}`}>
      {exercise.name}
      <button 
        onClick={() => onRemove(exercise.id)} 
        data-testid={`remove-${exercise.id}`}
        aria-label="Remove exercise"
      >
        Remove
      </button>
      {isDraggable && <div data-testid="drag-handle">Drag</div>}
    </div>
  )
}));

describe('RoutineBlock', () => {
  const mockExercises: RoutineExercise[] = [
    {
      id: 'ex1',
      name: 'Push-ups',
      sets: 3,
      reps: 10,
      duration: 60,
      tags: ['strength'],
      thumbnailUrl: 'https://example.com/push-ups.jpg',
      isResistance: true
    },
    {
      id: 'ex2',
      name: 'Squats',
      sets: 3,
      reps: 15,
      duration: 90,
      tags: ['strength', 'lower-body'],
      thumbnailUrl: 'https://example.com/squats.jpg',
      isResistance: true
    }
  ];

  const mockBlock: RoutineBlockType = {
    id: 'block1',
    name: 'Strength Training',
    type: 'main',
    position: 1,
    exercises: mockExercises
  };

  const defaultProps = {
    block: mockBlock,
    isExpanded: false,
    onToggleExpand: jest.fn(),
    onAddExercise: jest.fn(),
    onRemoveExercise: jest.fn(),
    onReorderExercises: jest.fn(),
    isEditMode: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the block name', () => {
    render(<RoutineBlock {...defaultProps} />);
    expect(screen.getByText('Strength Training')).toBeInTheDocument();
  });

  it('renders the exercise count', () => {
    render(<RoutineBlock {...defaultProps} />);
    expect(screen.getByText('2 exercises')).toBeInTheDocument();
  });

  it('renders singular exercise text when there is only one exercise', () => {
    const blockWithOneExercise = {
      ...mockBlock,
      exercises: [mockExercises[0]]
    };
    render(<RoutineBlock {...defaultProps} block={blockWithOneExercise} />);
    expect(screen.getByText('1 exercise')).toBeInTheDocument();
  });

  it('shows ChevronDown icon when collapsed', () => {
    render(<RoutineBlock {...defaultProps} />);
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
    // We can also check that the expanded content is not visible
    expect(screen.queryByText('Push-ups')).not.toBeInTheDocument();
  });

  it('shows ChevronUp icon and exercises when expanded', () => {
    render(<RoutineBlock {...defaultProps} isExpanded={true} />);
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
  });

  it('calls onToggleExpand when header is clicked', () => {
    render(<RoutineBlock {...defaultProps} />);
    fireEvent.click(screen.getByText('Strength Training'));
    expect(defaultProps.onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it('shows add exercise button in edit mode', () => {
    render(<RoutineBlock {...defaultProps} isEditMode={true} />);
    const addButton = screen.getByLabelText('Add exercise');
    expect(addButton).toBeInTheDocument();
  });

  it('calls onAddExercise when add button is clicked', () => {
    render(<RoutineBlock {...defaultProps} isEditMode={true} />);
    const addButton = screen.getByLabelText('Add exercise');
    fireEvent.click(addButton);
    expect(defaultProps.onAddExercise).toHaveBeenCalledTimes(1);
  });

  it('shows "No exercises added yet" message when block has no exercises', () => {
    const emptyBlock = {
      ...mockBlock,
      exercises: []
    };
    render(<RoutineBlock {...defaultProps} block={emptyBlock} isExpanded={true} />);
    expect(screen.getByText('No exercises added yet')).toBeInTheDocument();
  });

  it('renders exercises in a reorderable list in edit mode', () => {
    render(<RoutineBlock {...defaultProps} isEditMode={true} isExpanded={true} />);
    expect(screen.getByTestId('reorder-group')).toBeInTheDocument();
    expect(screen.getAllByTestId('exercise-ex1').length).toBe(1);
    expect(screen.getAllByTestId('exercise-ex2').length).toBe(1);
  });

  it('renders exercises in a regular list in view mode', () => {
    render(<RoutineBlock {...defaultProps} isEditMode={false} isExpanded={true} />);
    expect(screen.queryByTestId('reorder-group')).not.toBeInTheDocument();
    expect(screen.getByTestId('exercise-ex1')).toBeInTheDocument();
    expect(screen.getByTestId('exercise-ex2')).toBeInTheDocument();
  });

  it('calls onRemoveExercise with correct exercise ID when remove is clicked', () => {
    render(<RoutineBlock {...defaultProps} isEditMode={true} isExpanded={true} />);
    
    // Find the remove button for the first exercise and click it
    const removeButton = screen.getByTestId('remove-ex1');
    fireEvent.click(removeButton);
    
    expect(defaultProps.onRemoveExercise).toHaveBeenCalledWith('ex1');
  });
});
