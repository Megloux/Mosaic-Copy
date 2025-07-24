import { render, screen, fireEvent } from '@testing-library/react';
import { SaveButton } from '@/components/ui/buttons/SaveButton';

describe('SaveButton', () => {
  it('renders with default text', () => {
    render(<SaveButton onSave={async () => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Save');
  });

  it('calls onSave when clicked', async () => {
    const handleSave = jest.fn().mockResolvedValue(undefined);
    render(<SaveButton onSave={handleSave} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleSave).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<SaveButton onSave={async () => {}} isLoading />);
    expect(screen.getByRole('button')).toHaveTextContent('...');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('can be disabled', () => {
    render(<SaveButton onSave={async () => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<SaveButton onSave={async () => {}} className="test-class" />);
    expect(screen.getByRole('button')).toHaveClass('test-class');
  });

  it('renders custom children', () => {
    render(<SaveButton onSave={async () => {}}>Save Changes</SaveButton>);
    expect(screen.getByRole('button')).toHaveTextContent('Save Changes');
  });

  it('applies variant styles', () => {
    render(<SaveButton onSave={async () => {}} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200', 'text-gray-800');
  });

  it('applies size styles', () => {
    render(<SaveButton onSave={async () => {}} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('uses custom aria-label', () => {
    render(<SaveButton onSave={async () => {}} ariaLabel="Save document" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Save document');
  });
});
