import { sanityClient, isSanityConfigured } from '@/app/lib/sanity';

type NavigationPage = {
  _id: string;
  title?: string | null;
  navLabel?: string | null;
  slug?: string | null;
  group?: 'main' | 'about-us' | 'about-fasd' | 'events' | null;
  order?: number | null;
};

const NAVIGATION_QUERY = `
  *[
    _type == "contentPage" &&
    showInNavigation == true &&
    defined(slug.current) &&
    defined(navigationGroup)
  ] | order(navigationGroup asc, navigationOrder asc, title asc) {
    _id,
    title,
    "navLabel": navigationLabel,
    "slug": slug.current,
    "group": navigationGroup,
    "order": navigationOrder
  }
`;

export async function GET() {
  if (!isSanityConfigured()) {
    return Response.json({ items: [] });
  }

  try {
    const items = await sanityClient.fetch<NavigationPage[]>(NAVIGATION_QUERY);
    const normalized = (items || [])
      .filter((item) => item.slug != null && item.group != null)
      .map((item) => ({
        id: item._id,
        label: item.navLabel || item.title || item.slug,
        href: `/${item.slug}`,
        group: item.group as 'main' | 'about-us' | 'about-fasd' | 'events',
        order: item.order ?? 100,
      }));

    return Response.json({ items: normalized });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch navigation items';
    return Response.json({ error: message, items: [] }, { status: 502 });
  }
}
