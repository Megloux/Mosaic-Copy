import { render, screen } from '@testing-library/react';
import { CountdownTimer } from '@/features/workout-player/components/CountdownTimer';

describe('CountdownTimer', () => {
  it('renders with time remaining', () => {
    render(
      <CountdownTimer 
        timeRemaining={60} 
        totalDuration={120}
      >
        <div>01:00</div>
      </CountdownTimer>
    );
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('renders with zero time', () => {
    render(
      <CountdownTimer 
        timeRemaining={0} 
        totalDuration={60}
      >
        <div>00:00</div>
      </CountdownTimer>
    );
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60} 
        className="test-class"
      >
        <div>00:30</div>
      </CountdownTimer>
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('uses theme color when not in final countdown', () => {
    const themeColor = '#22D3EE';
    const { container } = render(
      <CountdownTimer 
        timeRemaining={30} 
        totalDuration={60}
        themeColor={themeColor}
      >
        <div>00:30</div>
      </CountdownTimer>
    );
    
    const svgElement = container.querySelector(`circle[stroke="${themeColor}"]`);
    expect(svgElement).toBeInTheDocument();
  });

  it('uses red color when in final countdown', () => {
    const { container } = render(
      <CountdownTimer 
        timeRemaining={3} 
        totalDuration={60}
        isInFinalCountdown={true}
      >
        <div>00:03</div>
      </CountdownTimer>
    );
    
    const svgElement = container.querySelector('circle[stroke="#ef4444"]');
    expect(svgElement).toBeInTheDocument();
  });
});
