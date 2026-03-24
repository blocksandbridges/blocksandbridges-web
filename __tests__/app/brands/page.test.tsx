import { render, screen } from '@testing-library/react';
import Brands from '@/app/brands/page';

describe('Brands page', () => {
  it('renders all two brand images with correct alt text', () => {
    render(<Brands />);
    expect(screen.getByRole('img', { name: /dragon's purr crafts and sundry/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /hipster donut apparel/i })).toBeInTheDocument();
  });

  it('Dragon\'s Purr Crafts and Sundry image has correct src', () => {
    render(<Brands />);
    const img = screen.getByRole('img', { name: /dragon's purr crafts and sundry/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('wide-logo-for-dark-bkgds.png'));
  });

  it('Hipster Donut Apparel image has correct src', () => {
    render(<Brands />);
    const img = screen.getByRole('img', { name: /hipster donut apparel/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('hipsterdonut-logo-wide.png'));
  });

  it('brand images are wrapped in links to the correct URLs', () => {
    render(<Brands />);
    const dragonLink = screen.getByRole('link', { name: /dragon's purr crafts and sundry/i });
    expect(dragonLink).toHaveAttribute('href', 'https://dragonspurr.ca');
    expect(dragonLink).toHaveAttribute('target', '_blank');
  });
});
