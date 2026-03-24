import { sanityClient, urlFor, isSanityConfigured } from '@/app/lib/sanity';
import type { NextRequest } from 'next/server';

const PER_PAGE = 1;

const BLOG_GROQ = `
  count(*[_type == "blogPost"])
`;

const BLOG_PAGE_GROQ = `
  *[_type == "blogPost"] | order(publishedAt desc, _createdAt desc) [$start...$end] {
    _id,
    title,
    publishedAt,
    "author": author->{ _id, name, "image": image },
    tags,
    content,
    "image": image
  }
`;

interface BlogPost {
  _id: string;
  title?: string | null;
  publishedAt?: string | null;
  author?: { _id: string; name?: string | null; image?: unknown } | null;
  tags?: string[] | null;
  content?: unknown[] | null;
  image?: unknown;
}

export async function GET(request: NextRequest) {
    if (!isSanityConfigured()) {
      return Response.json(
        { error: 'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally NEXT_PUBLIC_SANITY_DATASET).' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    try {
        const [total, items] = await Promise.all([
            sanityClient.fetch<number>(BLOG_GROQ),
            sanityClient.fetch<BlogPost[]>(BLOG_PAGE_GROQ, { start, end }),
        ]);

        const pages = Math.ceil((total || 0) / PER_PAGE) || 1;
        const blogPosts = (items || []).map((item) => {
            const image = item.image;
            const imageObj = image && typeof image === 'object' ? image as Record<string, unknown> : null;
            const imageUrl = image ? urlFor(image) : null;
            const caption = imageObj && typeof imageObj.caption === 'string' ? imageObj.caption : '';
            const authorImage = item.author?.image;
            const authorImageUrl = authorImage ? urlFor(authorImage).width(96).height(96).url() : null;
            return {
                id: item._id,
                title: item.title || '',
                publishedAt: item.publishedAt || null,
                author: item.author
                    ? { name: item.author.name ?? null, imageUrl: authorImageUrl }
                    : null,
                tags: item.tags && Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === 'string') : [],
                content: item.content && Array.isArray(item.content) ? item.content : [],
                image: imageUrl ? imageUrl.width(500).url() : null,
                imageCaption: caption || null,
            };
        });
        return Response.json({
            blogPosts,
            page,
            pages,
            total: total || 0,
            perPage: PER_PAGE,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch blog posts from Sanity';
        return Response.json(
            { error: message },
            { status: 502 }
        );
    }
}