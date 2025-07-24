import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { TimeInput } from '@/components/ui/form/TimeInput';

describe('TimeInput', () => {
  // Basic Rendering
  it('renders with default value', () => {
    const onChange = jest.fn();
    render(<TimeInput value="00:00" onChange={onChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('00:00');
  });

  // Format Validation Tests
  describe('format validation', () => {
    it('formats partial inputs correctly', () => {
      const onChange = jest.fn();
      render(<TimeInput value="2:30" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith('02:30');
    });

    it('handles empty input by resetting to 00:00', () => {
      const onChange = jest.fn();
      render(<TimeInput value="" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith('00:00');
    });

    it('enforces maximum time constraint', () => {
      const onChange = jest.fn();
      render(<TimeInput value="05:00" onChange={onChange} maxTimeSeconds={240} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '05:00' } });
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith('04:00'); // 240 seconds = 4 minutes
    });
  });

  // Keyboard Interaction Tests
  describe('keyboard interactions', () => {
    it('increments time by 5 seconds with arrow up', () => {
      const onChange = jest.fn();
      render(<TimeInput value="00:00" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(onChange).toHaveBeenCalledWith('00:05');
    });

    it('increments time by 60 seconds with shift + arrow up', () => {
      const onChange = jest.fn();
      render(<TimeInput value="00:00" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'ArrowUp', shiftKey: true });
      expect(onChange).toHaveBeenCalledWith('01:00');
    });
  });

  // Edge Cases
  describe('edge cases', () => {
    it('handles invalid input gracefully', () => {
      const onChange = jest.fn();
      render(<TimeInput value="invalid" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      expect(onChange).toHaveBeenCalledWith('00:00');
    });

    it('prevents negative values', () => {
      const onChange = jest.fn();
      render(<TimeInput value="00:00" onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(onChange).toHaveBeenCalledWith('00:00');
    });
  });

  // Accessibility Tests
  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<TimeInput 
        value="00:00" 
        onChange={() => {}} 
        label="Duration"
        error="Invalid time"
      />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Duration');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  // iOS Feature Tests (Note: These are limited in Jest, need manual testing)
  describe('iOS features', () => {
    it('enables scrubbing by default', () => {
      render(<TimeInput value="00:00" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-scrubbing-enabled', 'true');
    });

    it('can disable scrubbing', () => {
      render(<TimeInput value="00:00" onChange={() => {}} allowScrubbing={false} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-scrubbing-enabled', 'false');
    });
  });
});
