import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';

describe('Navigation', () => {
  it('renders the logo with correct alt text', () => {
    render(<Navigation />);
    expect(screen.getByAltText("Dragon's Purr Crafts and Sundry")).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /donate/i })).toBeInTheDocument();
  });

  it('links to correct internal paths', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/mission-and-vision');
    expect(screen.getByRole('link', { name: /events/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /donate/i })).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
  });

  it('Donate link opens in new tab', () => {
    render(<Navigation />);
    const donateLink = screen.getByRole('link', { name: /donate/i });
    expect(donateLink).toHaveAttribute('href', 'https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
    expect(donateLink).toHaveAttribute('target', '_blank');
    expect(donateLink).toHaveAttribute('rel', 'noreferrer');
  });
});
