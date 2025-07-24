import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/cards/cards/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Card title="Test Title">
        <div>Content</div>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Card description="Test Description">
        <div>Content</div>
      </Card>
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders action component when provided', () => {
    const TestAction = () => <button>Action</button>;
    render(
      <Card action={<TestAction />}>
        <div>Content</div>
      </Card>
    );
    expect(screen.getByRole('button')).toHaveTextContent('Action');
  });

  it('renders media component when provided', () => {
    const TestMedia = () => <img alt="test" src="test.jpg" />;
    render(
      <Card media={<TestMedia />}>
        <div>Content</div>
      </Card>
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders footer component when provided', () => {
    const TestFooter = () => <div>Footer</div>;
    render(
      <Card footer={<TestFooter />}>
        <div>Content</div>
      </Card>
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="test-class">
        <div>Content</div>
      </Card>
    );
    expect(container.firstChild).toHaveClass('test-class');
  });
});
