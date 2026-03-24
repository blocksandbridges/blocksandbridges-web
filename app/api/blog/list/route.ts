import { sanityClient, isSanityConfigured } from '@/app/lib/sanity';
import type { NextRequest } from 'next/server';

const BLOG_LIST_GROQ = `
  *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    publishedAt,
    "author": author->{ _id, name },
    tags,
    content
  }
`;

interface BlogPostRow {
  _id: string;
  title?: string | null;
  publishedAt?: string | null;
  author?: { _id: string; name?: string | null } | null;
  tags?: string[] | null;
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

/**
 * GET /api/blog/list
 * Returns all blog posts (id, title, publishedAt, excerpt) for sidebar calendar and search.
 */
export async function GET(request: NextRequest) {
  if (!isSanityConfigured()) {
    return Response.json(
      {
        error:
          'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally NEXT_PUBLIC_SANITY_DATASET).',
      },
      { status: 503 }
    );
  }

  try {
    const items = await sanityClient.fetch<BlogPostRow[]>(BLOG_LIST_GROQ);
    const posts = (items || []).map((item, index) => {
      const fullText = portableTextToPlainText(item.content);
      const excerpt = fullText.slice(0, 500);
      const tags = item.tags && Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === 'string') : [];
      return {
        id: item._id,
        title: item.title || '',
        publishedAt: item.publishedAt || null,
        author: item.author?.name ?? null,
        tags,
        excerpt,
        page: index + 1,
      };
    });
    return Response.json({ posts });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch blog list from Sanity';
    return Response.json({ error: message }, { status: 502 });
  }
}
