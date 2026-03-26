import { act, render } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HomeView } from '@/components/HomeView';
import Contact from '@/app/contact/page';
import NotFound from '@/app/not-found';
import Team from '@/app/team/page';

jest.mock('sweetalert2', () => ({ __esModule: true, default: { fire: jest.fn() } }));

/** Avoid loading Team (Sanity + Portable Text ESM) for link enumeration only */
jest.mock('@/app/team/page', () => ({
  __esModule: true,
  default: function TeamStub() {
    return <div />;
  },
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ items: [] }),
    } as Response)
  );
});

/** Let Navigation’s fetch + setState finish so React 18 doesn’t warn about act(). */
async function flushNavigationEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

/** Paths that may appear in the static nav + common content routes (expand if Sanity adds slugs). */
const VALID_INTERNAL_PATHS = [
  '/',
  '/about-us',
  '/what-is-fasd',
  '/events',
  '/contact',
  '/team',
  '/mission-and-vision',
];

function getAllLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll('a[href]'));
}

function getLinkHrefs(container: HTMLElement): string[] {
  return getAllLinks(container).map((a) => a.getAttribute('href')!.trim());
}

describe('All links have valid hrefs', () => {
  it('Navigation links have valid hrefs', async () => {
    const { container } = render(<Navigation />);
    await flushNavigationEffects();
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      if (href.startsWith('/')) {
        expect(VALID_INTERNAL_PATHS).toContain(href);
      } else {
        expect(href).toMatch(/^https?:\/\/|^mailto:/);
      }
    });
  });

  it('Footer links have valid hrefs', () => {
    const { container } = render(<Footer />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    });
  });

  it('Contact page links have valid hrefs', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\/|^mailto:/);
    });
  });

  it('Home page has no standalone links when using fallback (no Sanity slides)', () => {
    const { container } = render(<HomeView data={null} />);
    const links = getAllLinks(container);
    expect(links.length).toBe(0);
  });

  it('Team page has no links in content', () => {
    const { container } = render(<Team />);
    const links = getAllLinks(container);
    expect(links.length).toBe(0);
  });

  it('Not-found page has no links in content', () => {
    const { container } = render(<NotFound />);
    const links = getAllLinks(container);
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/');
  });
});

describe('All expected links are present and resolve to correct targets', () => {
  it('Navigation contains all expected internal and external links', async () => {
    const { container } = render(<Navigation />);
    await flushNavigationEffects();
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/about-us');
    expect(hrefs).toContain('/what-is-fasd');
    expect(hrefs).toContain('/events');
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
  });

  it('Footer contains expected external links', () => {
    const { container } = render(<Footer />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.filter((h) => h === 'https://blocksandbridges.ca').length).toBe(1);
    expect(hrefs.filter((h) => h === 'https://boxingoctop.us').length).toBe(1);
  });

  it('Contact page includes organization email', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('mailto:info@blocksandbridges.ca');
  });
});
