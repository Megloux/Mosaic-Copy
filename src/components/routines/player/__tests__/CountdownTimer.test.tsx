import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CountdownTimer } from '@/components/routines/player/components/CountdownTimer';

describe('CountdownTimer Component', () => {
  test('renders with correct time remaining', () => {
    render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
      >
        <div data-testid="timer-content">0:30</div>
      </CountdownTimer>
    );
    
    expect(screen.getByTestId('timer-content')).toHaveTextContent('0:30');
  });
  
  test('applies final countdown styling when in final countdown', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={3} 
        totalDuration={60}
        isInFinalCountdown={true}
      >
        <div>0:03</div>
      </CountdownTimer>
    );
    
    // The final countdown uses a red color (#ef4444)
    const svgElement = container.querySelector('circle[stroke="#ef4444"]');
    expect(svgElement).toBeInTheDocument();
  });
  
  test('uses theme color when not in final countdown', () => {
    const themeColor = '#22D3EE';
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
        themeColor={themeColor}
      >
        <div>0:30</div>
      </CountdownTimer>
    );
    
    const svgElement = container.querySelector(`circle[stroke="${themeColor}"]`);
    expect(svgElement).toBeInTheDocument();
  });
  
  test('uses smaller size for Apple Watch', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
        isAppleWatch={true}
      >
        <div>0:30</div>
      </CountdownTimer>
    );
    
    // Apple Watch uses a smaller SVG size
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', '180');
    expect(svgElement).toHaveAttribute('height', '180');
  });
  
  test('shows Digital Crown indicator only on Apple Watch', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
        isAppleWatch={true}
      >
        <div>0:30</div>
      </CountdownTimer>
    );
    
    // Check for Digital Crown indicator
    const crownIndicator = container.querySelector('.absolute.top-1\\/2.transform.-translate-y-1\\/2.w-1.h-12');
    expect(crownIndicator).toBeInTheDocument();
  });
  
  test('does not show Digital Crown indicator on mobile', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
        isAppleWatch={false}
      >
        <div>0:30</div>
      </CountdownTimer>
    );
    
    // Check that Digital Crown indicator is not present
    const crownIndicator = container.querySelector('.absolute.top-1\\/2.transform.-translate-y-1\\/2.w-1.h-12');
    expect(crownIndicator).not.toBeInTheDocument();
  });
});
