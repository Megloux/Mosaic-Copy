import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from '@/components/ui/Accordion';

describe('Accordion', () => {
  const items = [
    { id: '1', title: 'Item 1', content: 'Content 1' },
    { id: '2', title: 'Item 2', content: 'Content 2' }
  ];

  const setup = (props = {}) => {
    return render(
      <Accordion 
        items={items}
        {...props}
      />
    );
  };

  it('renders all items', () => {
    setup();
    items.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      const contentParent = screen.getByText(item.content).closest('div[class*="overflow-hidden"]');
      expect(contentParent).toHaveClass('max-h-0');
    });
  });

  it('expands item on click', () => {
    setup();
    const firstItem = screen.getByText(items[0].title);
    
    fireEvent.click(firstItem);
    const contentParent = screen.getByText(items[0].content).closest('div[class*="overflow-hidden"]');
    expect(contentParent).toHaveClass('max-h-screen');
  });

  it('collapses expanded item on second click', () => {
    setup();
    const firstItem = screen.getByText(items[0].title);
    const contentParent = screen.getByText(items[0].content).closest('div[class*="overflow-hidden"]');
    
    fireEvent.click(firstItem);
    expect(contentParent).toHaveClass('max-h-screen');
    
    fireEvent.click(firstItem);
    expect(contentParent).toHaveClass('max-h-0');
  });

  it('allows multiple items to be expanded when multiple is true', () => {
    setup({ multiple: true });
    const [firstItem, secondItem] = items.map(item => screen.getByText(item.title));
    
    fireEvent.click(firstItem);
    fireEvent.click(secondItem);
    
    const firstContentParent = screen.getByText(items[0].content).closest('div[class*="overflow-hidden"]');
    const secondContentParent = screen.getByText(items[1].content).closest('div[class*="overflow-hidden"]');
    expect(firstContentParent).toHaveClass('max-h-screen');
    expect(secondContentParent).toHaveClass('max-h-screen');
  });

  it('collapses other items when multiple is false', () => {
    setup();
    const [firstItem, secondItem] = items.map(item => screen.getByText(item.title));
    const firstContentParent = screen.getByText(items[0].content).closest('div[class*="overflow-hidden"]');
    const secondContentParent = screen.getByText(items[1].content).closest('div[class*="overflow-hidden"]');
    
    fireEvent.click(firstItem);
    expect(firstContentParent).toHaveClass('max-h-screen');
    
    fireEvent.click(secondItem);
    expect(firstContentParent).toHaveClass('max-h-0');
    expect(secondContentParent).toHaveClass('max-h-screen');
  });

  it('applies custom className', () => {
    const { container } = setup({ className: 'test-class' });
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('supports defaultExpanded items', () => {
    setup({ defaultExpanded: [items[0].id] });
    const firstContentParent = screen.getByText(items[0].content).closest('div[class*="overflow-hidden"]');
    const secondContentParent = screen.getByText(items[1].content).closest('div[class*="overflow-hidden"]');
    expect(firstContentParent).toHaveClass('max-h-screen');
    expect(secondContentParent).toHaveClass('max-h-0');
  });

  it('calls onExpandedChange when items expand/collapse', () => {
    const onExpandedChange = jest.fn();
    setup({ onExpandedChange });
    
    const firstItem = screen.getByText(items[0].title);
    fireEvent.click(firstItem);
    expect(onExpandedChange).toHaveBeenCalledWith([items[0].id]);
    
    fireEvent.click(firstItem);
    expect(onExpandedChange).toHaveBeenCalledWith([]);
  });

  it('shows item descriptions when provided', () => {
    const itemsWithDesc = [
      { ...items[0], description: 'Description 1' }
    ];
    setup({ items: itemsWithDesc });
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });
});
