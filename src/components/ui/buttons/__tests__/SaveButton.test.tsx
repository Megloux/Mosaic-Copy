import { render, screen, fireEvent } from '@testing-library/react';
import { SaveButton } from '@/components/ui/buttons/SaveButton';

describe('SaveButton', () => {
  // Test 1: Initial render
  it('renders with default text', () => {
    render(<SaveButton onSave={async () => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Save');
  });

  // Test 2: Click handling
  it('calls onSave when clicked', async () => {
    const handleSave = jest.fn();
    render(<SaveButton onSave={handleSave} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleSave).toHaveBeenCalled();
  });

  // Test 3: Disabled state
  it('can be disabled', () => {
    render(<SaveButton onSave={async () => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Test 4: Custom class name
  it('applies custom className', () => {
    render(<SaveButton onSave={async () => {}} className="test-class" />);
    expect(screen.getByRole('button')).toHaveClass('test-class');
  });
});
