'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import type { ReactNode } from 'react';

export function LayoutSwitcher({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  if (isStudio) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="bnb-main-content">
        <div className="w-full max-w-7xl mx-auto ">{children}</div>
      </main>
      <Footer />
    </>
  );
}
