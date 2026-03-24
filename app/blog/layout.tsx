import { siteInfo } from '@/app/lib/constants';
import type { ReactNode } from 'react';

const baseUrl = siteInfo.url.replace(/\/$/, '');

export const metadata = {
  alternates: {
    types: {
      'application/rss+xml': `${baseUrl}/blog/feed`,
    },
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
