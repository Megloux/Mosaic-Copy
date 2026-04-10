/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateCard } from '@/components/routines/builder/components/TemplateCard';
import { Template } from '@/types/templates';

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

describe('TemplateCard', () => {
  const mockTemplate: Template = {
    id: 'template1',
    name: 'Full Body Workout',
    description: 'A comprehensive workout targeting all major muscle groups',
    isProOnly: false,
    structure: {
      blocks: [
        {
          block_id: 'block1',
          name: 'Warm-up',
          template_tags: ['warmup'],
          exercise_count: { min: 3, max: 5 },
          instructions: 'Gentle movements to prepare the body',
          is_warmup: true,
          has_cardio_burst: false
        },
        {
          block_id: 'block2',
          name: 'Main Workout',
          template_tags: ['strength', 'full-body'],
          exercise_count: { min: 6, max: 10 },
          instructions: 'Focus on form and controlled movements',
          is_warmup: false,
          has_cardio_burst: true
        }
      ],
      estimatedDuration: 2700, // 45 minutes
      difficulty: 'intermediate',
      focus: ['strength', 'endurance', 'flexibility']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const defaultProps = {
    template: mockTemplate,
    onSelect: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the template name', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('Full Body Workout')).toBeInTheDocument();
  });

  it('renders the template description', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('A comprehensive workout targeting all major muscle groups')).toBeInTheDocument();
  });

  it('renders the difficulty level', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('intermediate')).toBeInTheDocument();
  });

  it('renders the block count', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('2 blocks')).toBeInTheDocument();
  });

  it('renders the estimated duration in minutes', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('renders focus tags', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.getByText('strength')).toBeInTheDocument();
    expect(screen.getByText('endurance')).toBeInTheDocument();
    expect(screen.getByText('flexibility')).toBeInTheDocument();
  });

  it('renders PRO badge for pro-only templates', () => {
    const proTemplate = {
      ...mockTemplate,
      isProOnly: true
    };
    render(<TemplateCard {...defaultProps} template={proTemplate} />);
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('does not render PRO badge for regular templates', () => {
    render(<TemplateCard {...defaultProps} />);
    expect(screen.queryByText('PRO')).not.toBeInTheDocument();
  });

  it('calls onSelect with template ID when Select Template button is clicked', () => {
    render(<TemplateCard {...defaultProps} />);
    const selectButton = screen.getByText('Select Template');
    fireEvent.click(selectButton);
    expect(defaultProps.onSelect).toHaveBeenCalledWith('template1');
  });
});
