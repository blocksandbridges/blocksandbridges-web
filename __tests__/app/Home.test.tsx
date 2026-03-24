import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the main tagline', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Blocks and Bridges/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fetal Alcohol Spectrum Disorder \(FASD\) Support and Awareness Organization/i)
    ).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Home />);
    expect(screen.getByAltText('Blocks and Bridges logo')).toBeInTheDocument();
  });

  it('logo has correct src', () => {
    render(<Home />);
    const img = screen.getByRole('img', { name: /blocks and bridges logo/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('color-combo-mark.png'));
  });
});
