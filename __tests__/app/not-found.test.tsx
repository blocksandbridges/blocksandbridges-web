import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('Not Found page', () => {
  it('renders the Page Not Found title', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders the wrong turn message', () => {
    render(<NotFound />);
    expect(screen.getByText(/oh no, you seem to have taken a wrong turn/i)).toBeInTheDocument();
  });

  it('links back to the home page', () => {
    render(<NotFound />);
    const home = screen.getByRole('link', { name: /go back to the home page/i });
    expect(home).toHaveAttribute('href', '/');
  });
});
