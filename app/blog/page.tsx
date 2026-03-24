'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface BlogPost {
  id: string;
  title: string;
  publishedAt: string | null;
  author: { name: string | null; imageUrl: string | null } | null;
  tags: string[];
  content: PortableTextBlock[];
  image: string | null;
  imageCaption: string | null;
}

interface BlogApiResponse {
  blogPosts: BlogPost[];
  page: number;
  pages: number;
  total: number;
  perPage: number;
}

interface ListPost {
  id: string;
  title: string;
  publishedAt: string | null;
  author: string | null;
  tags: string[];
  excerpt: string;
  page: number;
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listPosts, setListPosts] = useState<ListPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/blog?page=${page}`)
      .then((res) => {
        if (!res.ok) {
          return res
            .json()
            .then((body: { error?: string }) =>
              Promise.reject(new Error(body.error || res.statusText))
            );
        }
        return res.json();
      })
      .then((data: BlogApiResponse) => {
        setBlogPosts(data.blogPosts);
        setPages(data.pages);
        setTotal(data.total);
        setPerPage(data.perPage);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetch('/api/blog/list')
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data: { posts?: ListPost[] }) => setListPosts(data.posts || []))
      .catch(() => setListPosts([]));
  }, []);

  const hasPrev = page > 1;
  const hasNext = page < pages;

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return listPosts;
    const q = searchQuery.trim().toLowerCase();
    return listPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [listPosts, searchQuery]);

  const portableTextComponents: PortableTextComponents = useMemo(
    () => ({
      marks: {
        link: ({ value, children }) => {
          const href = value?.href ?? '#';
          const isExternal = href.startsWith('http');
          return (
            <a
              href={href}
              className="bnb-link"
              {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {children}
            </a>
          );
        },
      },
    }),
    []
  );

  const postsByMonth = useMemo(() => {
    const map = new Map<string, ListPost[]>();
    filteredPosts.forEach((post) => {
      const date = post.publishedAt ? new Date(post.publishedAt) : null;
      const key = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : 'No date';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    });
    const entries = Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
    return entries.map(([key, posts]) => {
      const [y, m] = key.split('-');
      const date = key === 'No date' ? null : new Date(Number(y), Number(m) - 1);
      const label = date
        ? date.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
        : 'No date';
      return { label, key, posts };
    });
  }, [filteredPosts]);

  const tagCloud = useMemo(() => {
    const countByTag = new Map<string, number>();
    listPosts.forEach((post) => {
      (post.tags || []).forEach((tag) => {
        const t = tag.trim();
        if (t) countByTag.set(t, (countByTag.get(t) || 0) + 1);
      });
    });
    return Array.from(countByTag.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [listPosts]);

  function formatDate(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="container mx-auto px-4">
      {error && (
        <div className="mb-6 rounded-lg bg-red-900/50 border border-red-700 px-4 py-3 text-red-200" role="alert">
          {error}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0 flex flex-col items-center">
          <div className="space-y-8 mb-6 w-full flex flex-col items-center">
            {loading ? (
              <div className="w-full md:max-w-[50%] min-w-0">
                <div className="h-32 bg-gray-900/40 rounded-lg animate-pulse" />
              </div>
            ) : (
              blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="w-full md:max-w-[80%] min-w-0 flex flex-col items-center bg-black/10 rounded-lg p-6"
                >
                  <h2 className="bnb-section-header text-center">{post.title}</h2>
                  {post.publishedAt && (
                    <time
                      dateTime={post.publishedAt}
                      className="block text-xl text-gray-400 mb-2"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  {post.author && (post.author.name || post.author.imageUrl) && (
                    <div className="flex items-center justify-center gap-3 mb-4" data-testid="post-author">
                      <button
                        type="button"
                        onClick={() => post.author?.name && setSearchQuery(post.author.name)}
                        className="flex items-center justify-center gap-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black text-left hover:opacity-90 transition-opacity"
                        aria-label={post.author.name ? `View all posts by ${post.author.name}` : undefined}
                      >
                        {post.author.imageUrl && (
                          <Image
                            src={post.author.imageUrl}
                            alt=""
                            width={48}
                            height={48}
                            className="rounded-full object-cover w-12 h-12 flex-shrink-0"
                          />
                        )}
                        {post.author.name && (
                          <span className="text-lg text-gray-400 hover:text-red-600 transition-colors">
                            {post.author.name}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                  {post.image && (
                    <figure className="w-full max-w-[80%] flex-shrink-0 mb-4">
                      <Image
                        src={post.image ?? ''}
                        alt={post.imageCaption || post.title || 'Blog image'}
                        width={800}
                        height={800}
                        className="rounded-lg object-cover w-full h-auto"
                      />
                      {post.imageCaption && (
                        <figcaption className="mt-1 text-lg text-gray-400 italic text-center">
                          {post.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  <div className="bnb-body-text w-full text-left [&_p]:mb-4 [&_p:last-child]:mb-0">
                    <PortableText value={post.content} components={portableTextComponents} />
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <ul className="flex flex-wrap justify-center gap-2 mt-4" aria-label="Tags">
                      {post.tags.map((tag) => (
                        <li key={tag}>
                          <span className="text-sm px-2 py-0.5 rounded bg-gray-700/60 text-gray-300">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            )}
          </div>
          {!loading && !error && pages > 1 && (
            <nav
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              aria-label="Blog pagination"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
                className="bnb-form-button"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-xl font-cormorant_garamond text-white">
                Page {page} of {pages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={!hasNext}
                className="bnb-form-button"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </div>

        <aside className="w-full lg:w-72 flex-shrink-0 order-first lg:order-last">
          <div className="lg:sticky lg:top-28 space-y-4">
            <a
              href="/blog/feed"
              className="text-gray-400 hover:text-red-500 text-lg font-cormorant_garamond"
            >
              RSS feed
            </a>
            <label htmlFor="blog-search" className="sr-only">
              Search posts by title, author, keyword, or tag
            </label>
            <input
              id="blog-search"
              type="search"
              placeholder="Search by title, author, keyword, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bnb-form-input"
              aria-label="Search posts by title, author, keyword, or tag"
            />
            {tagCloud.length > 0 && (
              <div>
                <h3 className="font-cinzel text-red-600 text-xl mb-2"><strong>Tags</strong></h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Tag cloud">
                  {tagCloud.map(({ tag, count }) => {
                    const isActive = searchQuery.trim().toLowerCase() === tag.toLowerCase();
                    const sizeClass = count >= 5 ? 'text-base' : count >= 2 ? 'text-sm' : 'text-xs';
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(isActive ? '' : tag)}
                        className={`${sizeClass} px-2 py-0.5 rounded transition-colors ${
                          isActive
                            ? 'bg-red-800 text-white'
                            : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 hover:text-white'
                        }`}
                        title={`${count} post${count === 1 ? '' : 's'}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <nav aria-label="Blog archive">
              <h3 className="font-cinzel text-red-600 text-xl mb-2"><strong>Archive</strong></h3>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {postsByMonth.length === 0 ? (
                  <p className="text-gray-400 text-lg">
                    {listPosts.length === 0 ? 'Loading…' : searchQuery ? 'No posts match.' : 'No posts yet.'}
                  </p>
                ) : (
                  postsByMonth.map(({ label, posts: monthPosts }) => (
                    <div key={label}>
                      <p className="font-cinzel text-lg text-gray-400 mb-1">{label}</p>
                      <ul className="space-y-0.5">
                        {monthPosts.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => setPage(p.page)}
                              className={`text-left w-full text-lg py-0.5 px-1 rounded transition-colors ${
                                page === p.page
                                  ? 'text-red-500 font-medium bg-red-950/40'
                                  : 'text-gray-200 hover:text-red-400 hover:bg-black/20'
                              }`}
                            >
                              {p.title || 'Untitled'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
