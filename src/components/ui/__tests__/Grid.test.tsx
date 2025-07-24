import { render, screen } from '@testing-library/react';
import { Grid } from '@/components/ui/Grid';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="test-class">
        <div>Item</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('applies gap classes', () => {
    const { container } = render(
      <Grid gap="medium">
        <div>Item</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('gap-4');
  });

  it('applies columns classes', () => {
    const { container } = render(
      <Grid cols={3}>
        <div>Item</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('lg:grid-cols-3');
  });

  it('applies responsive columns classes', () => {
    const { container } = render(
      <Grid cols={4}>
        <div>Item</div>
      </Grid>
    );
    expect(container.firstChild).toHaveClass('lg:grid-cols-4');
  });
});
