import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('renders Blocks and Bridges copyright link', () => {
    render(<Footer />);
    const bnbLink = screen.getByRole('link', { name: /blocks and bridges ltd/i });
    expect(bnbLink).toHaveAttribute('href', 'https://blocksandbridges.ca');
  });

  it('renders current year in copyright', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`©\\s*${year}`, 'i'))).toBeInTheDocument();
  });

  it('Boxing Octopus Creative link opens in new tab', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /boxing octopus creative/i })).toHaveAttribute('target', '_blank');
  });
});
