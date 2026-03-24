'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LogRocket from 'logrocket';
import { envConfig } from '@/app/lib/constants';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function initGA(): void {
  if (typeof window === 'undefined' || !envConfig.googleAnalyticsId) return;
  const id = envConfig.googleAnalyticsId;
  if (window.gtag) {
    window.gtag('config', id, { page_path: window.location.pathname });
    return;
  }
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  (window as Window & { gtag: (...args: unknown[]) => void }).gtag('js', new Date());
  gtag('config', id, { cookie_flags: 'SameSite=None; Secure' });
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (envConfig.logrocketId) {
      LogRocket.init(envConfig.logrocketId);
    }
  }, []);

  useEffect(() => {
    if (envConfig.googleAnalyticsId && typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', envConfig.googleAnalyticsId, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined' || !envConfig.googleAnalyticsId) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${envConfig.googleAnalyticsId}`;
    document.head.appendChild(script);
    script.onload = initGA;
  }, []);

  return null;
}
