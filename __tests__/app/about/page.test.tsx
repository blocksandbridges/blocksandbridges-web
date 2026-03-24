/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import About from '@/app/team/page';

describe('About page', () => {
  it('renders the profile image with correct alt text', () => {
    render(<About />);
    const img = screen.getByRole('img', { name: /kayt and ryan/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Kayt and Ryan');
  });

  it('profile image has correct src', () => {
    render(<About />);
    const img = screen.getByRole('img', { name: /ryan/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('kayt-and-ryan.png'));
  });

  it('renders the bio text', () => {
    render(<About />);
    expect(screen.getByText(/hi! we're kayt and ryan!/i)).toBeInTheDocument();
    expect(screen.getByText(/we started dragon's purr for a bunch of different reasons, but chief among them was a desire to share our creativity with the world, and to make dorky little trinkets that folks like us would find funny, charming, and above all, inclusive; it's our hope that you'll find a bit of yourselves in our quirky designs./i)).toBeInTheDocument();
    expect(screen.getByText(/beyond that, we believe in helping out where we can, and championing causes close to our hearts, both through the art we make, and through direct support in the form of charitable donations which come from the sale of that same art./i)).toBeInTheDocument();
  });
});
