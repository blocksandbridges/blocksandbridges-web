import { sanityClient, isSanityConfigured } from '@/app/lib/sanity';
import { siteInfo } from '@/app/lib/constants';

const BLOG_LIST_GROQ = `
  *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    publishedAt,
    "author": author->{ _id, name },
    content
  }
`;

interface BlogPostRow {
  _id: string;
  title?: string | null;
  publishedAt?: string | null;
  author?: { _id: string; name?: string | null } | null;
  content?: unknown[] | null;
}

function portableTextToPlainText(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      if (!block || typeof block !== 'object') return '';
      const b = block as Record<string, unknown>;
      if (b._type !== 'block' || !Array.isArray(b.children)) return '';
      return (b.children as Array<Record<string, unknown>>)
        .map((child) => (child.text as string) ?? '')
        .join('');
    })
    .join('\n')
    .trim();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc2822(date: string | null): string {
  if (!date) return new Date().toUTCString();
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export async function GET() {
  if (!isSanityConfigured()) {
    return new Response('Sanity is not configured.', { status: 503 });
  }

  try {
    const items = await sanityClient.fetch<BlogPostRow[]>(BLOG_LIST_GROQ);
    const baseUrl = siteInfo.url.replace(/\/$/, '');
    const blogUrl = `${baseUrl}/blog`;

    const posts = (items || []).map((item, index) => {
      const fullText = portableTextToPlainText(item.content);
      const excerpt = fullText.slice(0, 500) + (fullText.length > 500 ? '…' : '');
      const title = item.title || 'Untitled';
      const link = `${blogUrl}?page=${index + 1}`;
      const pubDate = toRfc2822(item.publishedAt || null);
      const author = item.author?.name ?? null;
      return { title, link, excerpt, pubDate, publishedAt: item.publishedAt, author };
    });

    const lastBuildDate = posts.length > 0 && posts[0].publishedAt
      ? toRfc2822(posts[0].publishedAt)
      : toRfc2822(null);

    const itemsXml = posts.map(({ title, link, excerpt, pubDate, author }) => `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(link)}</guid>${author ? `\n      <author>${escapeXml(author)}</author>` : ''}
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteInfo.name)} – Blog</title>
    <link>${escapeXml(blogUrl)}</link>
    <description>${escapeXml(siteInfo.description)}</description>
    <language>en-ca</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/blog/feed`)}" rel="self" type="application/rss+xml"/>${itemsXml}
  </channel>
</rss>`;

    return new Response(rss.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to build feed';
    return new Response(message, { status: 502 });
  }
}
