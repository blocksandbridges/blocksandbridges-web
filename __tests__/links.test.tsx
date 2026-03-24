import { render } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Home from '@/app/page';
import Team from '@/app/team/page';
import Contact from '@/app/contact/page';
import NotFound from '@/app/not-found';

jest.mock('sweetalert2', () => ({ __esModule: true, default: { fire: jest.fn() } }));

const VALID_INTERNAL_PATHS = ['/', '/mission-and-vision', '/what-is-fasd', '/contact', '/team'];

function getAllLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll('a[href]'));
}

function getLinkHrefs(container: HTMLElement): string[] {
  return getAllLinks(container).map((a) => a.getAttribute('href')!.trim());
}

describe('All links have valid hrefs', () => {
  it('Navigation links have valid hrefs', () => {
    const { container } = render(<Navigation />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThan(0);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      if (href.startsWith('/')) {
        expect(VALID_INTERNAL_PATHS).toContain(href);
      } else {
        expect(href).toMatch(/^https?:\/\//);
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

  it('Contact page social links have valid hrefs', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    hrefs.forEach((href) => {
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//);
    });
  });

  it('Home page has no standalone links (only nav/footer when in layout)', () => {
    const { container } = render(<Home />);
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
  it('Navigation contains all expected internal and external links', () => {
    const { container } = render(<Navigation />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/mission-and-vision');
    expect(hrefs).toContain('/what-is-fasd');
    expect(hrefs).toContain('/contact');
    expect(hrefs).toContain('https://www.paypal.com/ncp/payment/8WF6GYS6HXU34');
  });

  it('Footer contains expected external links', () => {
    const { container } = render(<Footer />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs.filter((h) => h === 'https://dragonspurr.ca').length).toBe(1);
    expect(hrefs.filter((h) => h === 'https://boxingoctop.us').length).toBe(1);
  });

  it('Contact page social links resolve to expected URLs', () => {
    const { container } = render(<Contact />);
    const hrefs = getLinkHrefs(container);
    expect(hrefs).toContain('https://bsky.app/profile/dragonspurr.bsky.social');
    expect(hrefs).toContain('https://hey.cafe/@dragonspurr');
    expect(hrefs).toContain('https://ehnw.ca/u/dragonspurr');
  });
});
