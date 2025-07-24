import { render, screen, fireEvent } from '@testing-library/react';
import { List } from '@/components/ui/List';

describe('List', () => {
  const items = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' }
  ];

  const keyExtractor = (item: typeof items[0]) => item.id;
  const renderItem = (item: typeof items[0]) => (
    <div key={item.id} data-testid={`item-${item.id}`}>{item.title}</div>
  );

  const setup = (props = {}) => {
    return render(
      <List 
        items={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        {...props}
      />
    );
  };

  it('renders items correctly', () => {
    setup();
    items.forEach(item => {
      expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
    });
  });

  it('handles item selection', () => {
    const onSelectionChange = jest.fn();
    setup({ 
      selectable: true,
      onSelectionChange
    });
    
    fireEvent.click(screen.getByTestId(`item-${items[0].id}`).parentElement!);
    expect(onSelectionChange).toHaveBeenCalledWith([items[0].id]);
  });

  it('shows loading state', () => {
    setup({
      items: [],
      loading: true
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status').querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const error = new Error('Test error');
    setup({
      items: [],
      error
    });
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    const emptyState = 'No items found';
    setup({
      items: [],
      emptyState
    });
    expect(screen.getByText(emptyState)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = setup({
      className: 'test-class'
    });
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('supports selectable mode', () => {
    setup({
      selectable: true
    });
    const list = screen.getByRole('listbox');
    expect(list).toHaveAttribute('aria-multiselectable', 'true');
    items.forEach(item => {
      const option = screen.getByTestId(`item-${item.id}`).parentElement;
      expect(option).toHaveAttribute('role', 'option');
      expect(option).toHaveAttribute('aria-selected', 'false');
    });
  });

  it('shows selected items', () => {
    setup({
      selectable: true,
      selectedIds: [items[0].id]
    });
    const firstItemParent = screen.getByTestId(`item-${items[0].id}`).parentElement;
    const secondItemParent = screen.getByTestId(`item-${items[1].id}`).parentElement;
    
    expect(firstItemParent).toHaveClass('bg-primary/5');
    expect(firstItemParent).toHaveAttribute('aria-selected', 'true');
    expect(secondItemParent).not.toHaveClass('bg-primary/5');
    expect(secondItemParent).toHaveAttribute('aria-selected', 'false');
  });
});
