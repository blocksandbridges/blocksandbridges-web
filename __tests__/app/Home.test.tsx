import { render, screen } from '@testing-library/react';
import { HomeView } from '@/components/HomeView';

describe('Home page', () => {
  it('renders fallback when Sanity has no home slides', () => {
    render(<HomeView data={null} />);
    expect(
      screen.getByText(/Fetal Alcohol Spectrum Disorder \(FASD\) Support and Awareness Organization/i)
    ).toBeInTheDocument();
  });

  it('renders the logo image in fallback', () => {
    render(<HomeView data={null} />);
    expect(screen.getByAltText('Blocks and Bridges logo')).toBeInTheDocument();
  });

  it('logo has correct src in fallback', () => {
    render(<HomeView data={null} />);
    const img = screen.getByRole('img', { name: /blocks and bridges logo/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('color-combo-mark.png'));
  });

  it('renders slideshow when slides exist', () => {
    render(
      <HomeView
        data={{
          slideIntervalSeconds: 6,
          slides: [
            {
              imageUrl: 'https://cdn.sanity.io/images/test/project/hero-1.jpg',
              alt: 'Community event',
              title: 'Welcome',
              subtitle: 'Supporting families.',
              linkUrl: null,
              linkLabel: null,
            },
          ],
        }}
      />
    );
    expect(screen.getByRole('region', { name: /home page highlights/i })).toBeInTheDocument();
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Fetal Alcohol Spectrum Disorder \(FASD\) affects an estimated 1\.5 million people in Canada/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /But that is an underestimation; many cases of FASD are never diagnosed/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: /^How You Can Help$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /There are three main ways you can help us to support our families/i,
      })
    ).toBeInTheDocument();
    const actionLinks = screen.getAllByRole('link', { name: /^(Donate|Volunteer|Learn More)$/ });
    expect(actionLinks).toHaveLength(3);
    actionLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
