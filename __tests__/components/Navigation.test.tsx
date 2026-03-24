import { render, screen, waitFor } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    } as Response)
  );
});

describe('Navigation', () => {
  it('renders the logo with correct alt text', async () => {
    render(<Navigation />);
    expect(screen.getByAltText('Blocks and Bridges')).toBeInTheDocument();
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('renders navigation links', async () => {
    render(<Navigation />);
    await screen.findByRole('link', { name: 'Home' });
    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Events' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Donate' })).toBeInTheDocument();
  });

  it('links to correct internal paths', async () => {
    render(<Navigation />);
    await screen.findByRole('link', { name: 'Home' });
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about-us');
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('href', '/events');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
  });

  it('Donate link opens in new tab', async () => {
    render(<Navigation />);
    const donateLink = await screen.findByRole('link', { name: 'Donate' });
    expect(donateLink).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
    expect(donateLink).toHaveAttribute('target', '_blank');
    expect(donateLink).toHaveAttribute('rel', 'noreferrer');
  });
});
