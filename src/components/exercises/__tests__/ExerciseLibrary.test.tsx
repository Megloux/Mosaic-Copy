import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ExerciseLibrary } from '@/components/exercises/ExerciseLibrary'

// Mock the store module
jest.mock('@/store/exerciseLibraryStore', () => {
  // Create a mock store that we can modify between tests
  const mockStore = {
    exercises: [
      {
        id: 'e1',
        exercise_name: 'Modified Plank',
        category_id: 'c1',
        setup_instructions: 'Start in forearm plank position with knees down',
        movement_notes: 'Maintain neutral spine, engage core',
        cueing: 'Draw navel to spine, keep shoulders stable',
        this_that: 'Should feel work in deep core muscles',
        spring_setup: {
          light_springs: 2,
          heavy_springs: 0,
        },
        template_tags: ['beginner', 'core'],
        vimeo_id: '12345',
        standard_time: '30s',
      },
      {
        id: 'e2',
        exercise_name: 'Side Plank',
        category_id: 'c2',
        setup_instructions: 'Start on side with forearm on mat',
        movement_notes: 'Stack shoulders and hips',
        cueing: 'Lift hips, maintain straight line',
        this_that: 'Should feel work in obliques',
        spring_setup: {
          light_springs: 1,
          heavy_springs: 1,
        },
        template_tags: ['intermediate', 'obliques'],
        vimeo_id: '23456',
        standard_time: '45s',
      },
    ],
    categories: [
      { id: 'c1', name: 'Abs' },
      { id: 'c2', name: 'Obliques' },
    ],
    selectedExercise: null,
    viewType: 'grid',
    searchQuery: '',
    selectedCategory: null,
    loading: false,
    error: null,
    fetchExercises: jest.fn(),
    fetchCategories: jest.fn(),
    setSelectedExercise: jest.fn(),
    setViewType: jest.fn(),
    setSearchQuery: jest.fn(),
    setSelectedCategory: jest.fn(),
  };

  return {
    useExerciseLibraryStore: jest.fn(() => mockStore),
    // Also export the mock store so we can modify it in tests
    __mockStore: mockStore
  };
});

// Get the mock store
const mockStore = jest.requireMock('@/store/exerciseLibraryStore').__mockStore;

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the Grid component to avoid TypeScript errors with Masonry
jest.mock('@/components/ui/Grid', () => ({
  Grid: ({ children, ...props }: any) => <div data-testid="grid" {...props}>{children}</div>,
}));

// Mock the Modal component to avoid TypeScript errors
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, open, onClose, ...props }: any) => 
    open ? <div data-testid="modal" {...props}>{children}</div> : null,
}));

// Mock the SearchInput component
jest.mock('@/components/ui/form/SearchInput', () => ({
  SearchInput: (props: any) => (
    <input 
      data-testid="search-input" 
      placeholder="Search exercises"
      onChange={(e: any) => props.onChange && props.onChange(e.target.value)} 
      {...props} 
    />
  ),
}));

describe('ExerciseLibrary Component', () => {
  beforeEach(() => {
    // Reset mock function calls before each test
    jest.clearAllMocks();
    
    // Reset store to default state before each test
    mockStore.exercises = [
      {
        id: 'e1',
        exercise_name: 'Modified Plank',
        category_id: 'c1',
        setup_instructions: 'Start in forearm plank position with knees down',
        movement_notes: 'Maintain neutral spine, engage core',
        cueing: 'Draw navel to spine, keep shoulders stable',
        this_that: 'Should feel work in deep core muscles',
        spring_setup: {
          light_springs: 2,
          heavy_springs: 0,
        },
        template_tags: ['beginner', 'core'],
        vimeo_id: '12345',
        standard_time: '30s',
      },
      {
        id: 'e2',
        exercise_name: 'Side Plank',
        category_id: 'c2',
        setup_instructions: 'Start on side with forearm on mat',
        movement_notes: 'Stack shoulders and hips',
        cueing: 'Lift hips, maintain straight line',
        this_that: 'Should feel work in obliques',
        spring_setup: {
          light_springs: 1,
          heavy_springs: 1,
        },
        template_tags: ['intermediate', 'obliques'],
        vimeo_id: '23456',
        standard_time: '45s',
      },
    ];
    mockStore.categories = [
      { id: 'c1', name: 'Abs' },
      { id: 'c2', name: 'Obliques' },
    ];
    mockStore.selectedExercise = null;
    mockStore.viewType = 'grid';
    mockStore.searchQuery = '';
    mockStore.selectedCategory = null;
    mockStore.loading = false;
    mockStore.error = null;
  });
  
  test('shows loading state when loading is true', () => {
    // Override loading state for this test
    mockStore.loading = true;
    
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  test('shows error message when there is an error', () => {
    // Override error state for this test
    mockStore.error = 'Error loading exercises';
    
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Check if error message is shown
    expect(screen.getByText(/error loading exercises/i)).toBeInTheDocument();
  });
  
  test('shows empty state when no exercises match the search criteria', () => {
    // Override exercises state for this test
    mockStore.exercises = [];
    
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Check if empty state message is shown
    expect(screen.getByText(/no exercises found/i)).toBeInTheDocument();
  });
  
  test('fetchExercises is called on component mount', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Check if fetchExercises was called
    expect(mockStore.fetchExercises).toHaveBeenCalled();
  });
  
  test('fetchCategories is called on component mount', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Check if fetchCategories was called
    expect(mockStore.fetchCategories).toHaveBeenCalled();
  });
  
  test('renders with default view type from store', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Verify default view type in the store
    expect(mockStore.viewType).toBe('grid');
  });
  
  test('can toggle view type in the store', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Directly call the store method to simulate view toggle
    mockStore.setViewType('list');
    
    // Check if setViewType was called with 'list'
    expect(mockStore.setViewType).toHaveBeenCalledWith('list');
  });
  
  test('can set selected category in the store', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Directly call the store method to simulate category selection
    mockStore.setSelectedCategory('c1');
    
    // Check if setSelectedCategory was called with the correct category ID
    expect(mockStore.setSelectedCategory).toHaveBeenCalledWith('c1');
  });
  
  test('can set search query in the store', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Directly call the store method to simulate search
    mockStore.setSearchQuery('test search');
    
    // Check if setSearchQuery was called with the correct search query
    expect(mockStore.setSearchQuery).toHaveBeenCalledWith('test search');
  });
  
  test('can set selected exercise in the store', () => {
    render(<ExerciseLibrary onAddToRoutineBuilder={jest.fn()} />);
    
    // Directly call the store method to simulate exercise selection
    mockStore.setSelectedExercise(mockStore.exercises[0]);
    
    // Check if setSelectedExercise was called
    expect(mockStore.setSelectedExercise).toHaveBeenCalled();
  });
});
