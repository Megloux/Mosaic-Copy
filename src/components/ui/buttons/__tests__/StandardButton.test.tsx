import { render, screen, fireEvent } from '@testing-library/react';
import { StandardButton } from '@/components/ui/buttons/StandardButton';

describe('StandardButton', () => {
  it('renders children correctly', () => {
    render(<StandardButton>Click me</StandardButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<StandardButton onClick={handleClick}>Click me</StandardButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<StandardButton disabled>Click me</StandardButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<StandardButton variant="secondary">Click me</StandardButton>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });

  it('applies custom className', () => {
    const { container } = render(<StandardButton className="test-class">Click me</StandardButton>);
    expect(container.firstChild).toHaveClass('test-class');
  });
});
