import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SaveButton } from '../ui/buttons/SaveButton';

describe('SaveButton', () => {
  it('renders Save initially', () => {
    render(<SaveButton isSaved={false} onSaveChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Save');
  });

  it('shows checkmark when saved', () => {
    render(<SaveButton isSaved={true} onSaveChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('✓');
  });

  it('calls onSaveChange when clicked', () => {
    const mockSave = jest.fn();
    render(<SaveButton isSaved={false} onSaveChange={mockSave} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockSave).toHaveBeenCalledWith(true);
  });
});
