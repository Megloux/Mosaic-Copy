/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutineHeader } from '@/components/routines/builder/components/RoutineHeader';

describe('RoutineHeader', () => {
  const defaultProps = {
    title: 'Test Routine',
    duration: 1800, // 30 minutes
    onPlay: jest.fn(),
    onFavorite: jest.fn(),
    onShare: jest.fn(),
    onDownload: jest.fn(),
    isFavorite: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the routine title', () => {
    render(<RoutineHeader {...defaultProps} />);
    expect(screen.getByText('Test Routine')).toBeInTheDocument();
  });

  it('renders the formatted duration', () => {
    render(<RoutineHeader {...defaultProps} />);
    expect(screen.getByText('30min')).toBeInTheDocument();
  });

  it('renders the formatted duration for hours', () => {
    render(<RoutineHeader {...defaultProps} duration={3600} />);
    expect(screen.getByText('1h 0min')).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', () => {
    render(<RoutineHeader {...defaultProps} />);
    const playButton = screen.getByLabelText('Start routine');
    fireEvent.click(playButton);
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onFavorite when favorite button is clicked', () => {
    render(<RoutineHeader {...defaultProps} />);
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    expect(defaultProps.onFavorite).toHaveBeenCalledTimes(1);
  });

  it('calls onShare when share button is clicked', () => {
    render(<RoutineHeader {...defaultProps} />);
    const shareButton = screen.getByLabelText('Share routine');
    fireEvent.click(shareButton);
    expect(defaultProps.onShare).toHaveBeenCalledTimes(1);
  });

  it('calls onDownload when download button is clicked', () => {
    render(<RoutineHeader {...defaultProps} />);
    const downloadButton = screen.getByLabelText('Download routine');
    fireEvent.click(downloadButton);
    expect(defaultProps.onDownload).toHaveBeenCalledTimes(1);
  });

  it('renders favorite button with filled heart when routine is favorited', () => {
    render(<RoutineHeader {...defaultProps} isFavorite={true} />);
    const favoriteButton = screen.getByLabelText('Remove from favorites');
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton.querySelector('svg')).toHaveClass('fill-pink-500');
  });

  it('renders favorite button with empty heart when routine is not favorited', () => {
    render(<RoutineHeader {...defaultProps} isFavorite={false} />);
    const favoriteButton = screen.getByLabelText('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton.querySelector('svg')).not.toHaveClass('fill-pink-500');
  });
});
