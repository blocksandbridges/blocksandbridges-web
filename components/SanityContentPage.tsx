import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

type SanityContentPageProps = {
  title: string;
  content: PortableTextBlock[];
  heroImageUrl?: string | null;
  emptyMessage?: string;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-merriweather text-bnb-dark-blue mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-merriweather text-bnb-dark-blue mb-5">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-merriweather text-bnb-dark-blue mb-4">{children}</h3>,
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-bnb-light-blue pl-4 italic mb-4">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
};

export function SanityContentPage({
  title,
  content,
  heroImageUrl,
  emptyMessage = 'No page content found in Sanity yet.',
}: SanityContentPageProps) {
  return (
    <div className="bnb-content-page-root">
      <section className="bnb-hero-banner">
        {heroImageUrl != null && (
          <>
            <div
              className="bnb-hero-banner-image"
              style={{ backgroundImage: `url(${heroImageUrl})` }}
              aria-hidden="true"
            />
            <div className="bnb-hero-banner-overlay" aria-hidden="true" />
          </>
        )}
        <div className="bnb-hero-banner-bottom-fade" aria-hidden="true" />
        <div className="container mx-auto relative z-10">
          <h1 className="bnb-hero-banner-title">{title}</h1>
        </div>
      </section>

      <section className="container mx-auto py-10 md:py-14">
        <div className="bnb-body-text max-w-4xl">
          {content.length > 0 ? (
            <PortableText value={content} components={portableTextComponents} />
          ) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}
