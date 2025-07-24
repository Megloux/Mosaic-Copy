import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

// Mock portal container
beforeEach(() => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  const portalRoot = document.getElementById('portal-root');
  if (portalRoot) {
    document.body.removeChild(portalRoot);
  }
});

describe('Modal', () => {
  const defaultProps = {
    open: false,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  it('renders when open', () => {
    render(<Modal {...defaultProps} open />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} open onClose={onClose} />);
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking backdrop', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} open onClose={onClose} />);
    
    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Modal {...defaultProps} open className="test-class" />
    );
    const content = screen.getByRole('dialog').querySelector('div[role="dialog"] > div');
    expect(content).toHaveClass('test-class');
  });

  it('renders with custom size', () => {
    render(<Modal {...defaultProps} open size="large" />);
    const content = screen.getByRole('dialog').querySelector('div[role="dialog"] > div');
    expect(content).toHaveClass('max-w-2xl');
  });

  it('shows description when provided', () => {
    const description = 'Test description';
    render(<Modal {...defaultProps} open description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('closes on ESC key press', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} open onClose={onClose} />);
    
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
