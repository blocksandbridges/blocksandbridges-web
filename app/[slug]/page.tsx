import { notFound } from 'next/navigation';
import type { PortableTextBlock } from '@portabletext/types';
import { client } from '@/sanity/lib/client';
import { SanityContentPage } from '@/components/SanityContentPage';

type ContentPageData = {
  title: string;
  heroImageUrl: string | null;
  content: PortableTextBlock[];
} | null;

const contentPageQuery = `
  *[_type == "contentPage" && slug.current == $slug][0] {
    title,
    "heroImageUrl": heroImage.asset->url,
    content
  }
`;

export default async function DynamicContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await client.fetch<ContentPageData>(contentPageQuery, { slug });

  if (pageData == null) {
    notFound();
  }

  return (
    <SanityContentPage
      title={pageData.title}
      heroImageUrl={pageData.heroImageUrl}
      content={pageData.content ?? []}
      emptyMessage={`No content found for "${slug}" yet.`}
    />
  );
}
