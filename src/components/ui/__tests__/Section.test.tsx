import { render, screen } from '@testing-library/react';
import { Section } from '@/components/ui/Section';

describe('Section', () => {
  it('renders children correctly', () => {
    render(<Section>Test content</Section>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders heading when provided', () => {
    render(
      <Section heading="Test Heading">
        Content
      </Section>
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Test Heading');
  });

  it('renders description when provided', () => {
    render(
      <Section 
        heading="Test Heading" 
        description="Test Description"
      >
        Content
      </Section>
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders action component when provided', () => {
    const TestAction = () => <button>Action</button>;
    render(
      <Section 
        heading="Test" 
        action={<TestAction />}
      >
        Content
      </Section>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Action');
  });

  it('applies sticky header styles when enabled', () => {
    render(
      <Section 
        heading="Sticky Header" 
        stickyHeader
      >
        Content
      </Section>
    );
    expect(screen.getByRole('heading').parentElement?.parentElement).toHaveClass('sticky', 'top-0', 'z-10', 'bg-background/80', 'backdrop-blur');
  });

  it('applies full height styles when enabled', () => {
    const { container } = render(
      <Section fullHeight>
        Content
      </Section>
    );
    expect(container.firstChild).toHaveClass('min-h-[100vh]');
  });
});
