/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutinePlayer } from '@/components/routines/player/index';
import { Routine } from '@/features/routines/model/types';

// Properly type the mock function
const mockUseRoutinePlayerStore = jest.fn();

// Mock the store
jest.mock('../../model/routinePlayerStore', () => ({
  __esModule: true,
  useRoutinePlayerStore: (...args: any[]) => mockUseRoutinePlayerStore(...args)
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { initial, animate, transition, whileTap, ...validProps } = props;
      return <div {...validProps}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      // Filter out framer-motion specific props
      const { initial, animate, transition, whileTap, ...validProps } = props;
      return <button {...validProps}>{children}</button>;
    }
  },
}));

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Play: (props: any) => <div data-testid="play-icon" {...props} />,
  Pause: (props: any) => <div data-testid="pause-icon" {...props} />,
  SkipBack: (props: any) => <div data-testid="skip-back-icon" {...props} />,
  SkipForward: (props: any) => <div data-testid="skip-forward-icon" {...props} />
}));

// Mock the ExerciseTimer and ExercisePreview components
jest.mock('../components/ExerciseTimer', () => ({
  __esModule: true,
  default: ({ timeRemaining, totalDuration }: any) => (
    <div data-testid="exercise-timer">
      <span data-testid="time-remaining">{timeRemaining}</span>
      <span data-testid="total-duration">{totalDuration}</span>
    </div>
  )
}));

jest.mock('../components/ExercisePreview', () => ({
  __esModule: true,
  default: ({ exercise, isSecondary }: any) => (
    <div data-testid={isSecondary ? "following-exercise" : "next-exercise"}>
      {exercise.name}
    </div>
  )
}));

describe('RoutinePlayer', () => {
  const mockRoutine: Routine = {
    id: 'routine1',
    name: 'Test Routine',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalDuration: 225, // 45 + 60 + 120
    difficulty: 2, // 1=beginner, 2=intermediate, 3=advanced
    userId: 'user123',
    isPublic: false,
    tags: ['core', 'legs'],
    blocks: [
      {
        id: 'block1',
        name: 'Block 1',
        position: 0,
        type: 'main',
        exercises: [
          {
            id: 'ex1',
            name: 'P2P',
            duration: 45,
            sets: 1,
            reps: 1,
            tags: ['core'],
            thumbnailUrl: '',
            isResistance: false
          },
          {
            id: 'ex2',
            name: 'Bear',
            duration: 60,
            sets: 1,
            reps: 1,
            tags: ['core'],
            thumbnailUrl: '',
            isResistance: false
          },
          {
            id: 'ex3',
            name: 'Platform Lunge',
            duration: 120,
            sets: 1,
            reps: 1,
            tags: ['legs'],
            thumbnailUrl: '',
            isResistance: false
          }
        ]
      }
    ]
  };

  const defaultStoreState = {
    routine: mockRoutine,
    currentExerciseIndex: 0,
    timeRemaining: 45,
    totalDuration: 45,
    isPlaying: false,
    nextExercise: mockRoutine.blocks[0].exercises[1],
    followingExercise: mockRoutine.blocks[0].exercises[2],
    initialize: jest.fn(),
    startWorkout: jest.fn(),
    pauseWorkout: jest.fn(),
    resumeWorkout: jest.fn(),
    goToNextExercise: jest.fn(),
    goToPreviousExercise: jest.fn(),
    setTimeRemaining: jest.fn(),
    resetWorkout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default mock implementation
    mockUseRoutinePlayerStore.mockReturnValue(defaultStoreState);
  });

  it('renders the current exercise name', () => {
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(screen.getByText('P2P')).toBeInTheDocument();
  });

  it('initializes the store with the routine on mount', () => {
    const initializeMock = jest.fn();
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      initialize: initializeMock
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(initializeMock).toHaveBeenCalledWith(mockRoutine);
  });

  it('displays the exercise timer with correct props', () => {
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(screen.getByTestId('exercise-timer')).toBeInTheDocument();
    expect(screen.getByTestId('time-remaining').textContent).toBe('45');
    expect(screen.getByTestId('total-duration').textContent).toBe('45');
  });

  it('displays the next and following exercises', () => {
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(screen.getByTestId('next-exercise')).toBeInTheDocument();
    expect(screen.getByText('Bear')).toBeInTheDocument();
    expect(screen.getByTestId('following-exercise')).toBeInTheDocument();
    expect(screen.getByText('Platform Lunge')).toBeInTheDocument();
  });

  it('shows play button when paused', () => {
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });

  it('shows pause button when playing', () => {
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      isPlaying: true
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
  });

  it('calls startWorkout when play is clicked and workout has not started', () => {
    const startWorkoutMock = jest.fn();
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      startWorkout: startWorkoutMock
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    
    const playButton = screen.getByRole('button', { name: /play workout/i });
    fireEvent.click(playButton);
    
    expect(startWorkoutMock).toHaveBeenCalled();
  });

  it('calls pauseWorkout when pause is clicked', () => {
    const pauseWorkoutMock = jest.fn();
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      isPlaying: true,
      pauseWorkout: pauseWorkoutMock
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    
    const pauseButton = screen.getByRole('button', { name: /pause workout/i });
    fireEvent.click(pauseButton);
    
    expect(pauseWorkoutMock).toHaveBeenCalled();
  });

  it('calls goToNextExercise when next button is clicked', () => {
    const goToNextExerciseMock = jest.fn();
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      goToNextExercise: goToNextExerciseMock
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    
    const nextButton = screen.getByRole('button', { name: /next exercise/i });
    fireEvent.click(nextButton);
    
    expect(goToNextExerciseMock).toHaveBeenCalled();
  });

  it('calls goToPreviousExercise when previous button is clicked', () => {
    const goToPreviousExerciseMock = jest.fn();
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      currentExerciseIndex: 1, // Set to a non-zero value so the previous button is not disabled
      goToPreviousExercise: goToPreviousExerciseMock
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    
    const prevButton = screen.getByRole('button', { name: /previous exercise/i });
    fireEvent.click(prevButton);
    
    expect(goToPreviousExerciseMock).toHaveBeenCalled();
  });

  it('shows loading state when routine is not available', () => {
    mockUseRoutinePlayerStore.mockReturnValue({
      ...defaultStoreState,
      routine: null
    });
    
    render(<RoutinePlayer routine={mockRoutine} onClose={() => {}} />);
    
    expect(screen.getByText('Loading workout...')).toBeInTheDocument();
  });
});
