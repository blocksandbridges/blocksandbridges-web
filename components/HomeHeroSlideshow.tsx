'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { externalLinkAttributes } from '@/app/lib/constants';
import type { HomeSlidePayload } from '@/app/lib/homePageQuery';

function isExternalUrl(href: string) {
  return /^https?:\/\//i.test(href);
}

type HomeHeroSlideshowProps = {
  slides: HomeSlidePayload[];
  intervalMs: number;
};

export function HomeHeroSlideshow({ slides, intervalMs }: HomeHeroSlideshowProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => {
        const n = slides.length;
        return (i + dir + n) % n;
      });
    },
    [slides.length]
  );

  /** Manual navigation pauses autoplay until the user leaves the banner (desktop) or for the rest of the visit (touch). */
  const goManual = useCallback(
    (dir: 1 | -1) => {
      setPaused(true);
      go(dir);
    },
    [go]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, paused]);

  const slide = slides[active];
  if (slide == null || slide.imageUrl == null) return null;

  const title = slide.title?.trim();
  const subtitle = slide.subtitle?.trim();
  const hasCta = Boolean(slide.linkUrl?.trim() && slide.linkLabel?.trim());

  return (
    <div className="bnb-content-page-root w-full">
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label="Home page highlights"
        className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] min-h-[min(85vh,720px)] md:min-h-[min(70vh,800px)] overflow-hidden bg-bnb-dark-blue [filter:drop-shadow(0_6px_28px_rgba(51,76,111,0.48))_drop-shadow(0_12px_36px_rgba(0,0,0,0.32))]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => {
          if (s.imageUrl == null) return null;
          const isVisible = i === active;
          return (
            <div
              key={`${s.imageUrl}-${i}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isVisible ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
              }`}
              aria-hidden={!isVisible}
            >
              <div className="absolute inset-0">
                <Image
                  src={s.imageUrl}
                  alt={s.alt?.trim() || s.title?.trim() || `Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
              <div className="bnb-hero-banner-overlay" aria-hidden="true" />
            </div>
          );
        })}

        <div className="relative z-20 flex min-h-[min(85vh,720px)] md:min-h-[min(70vh,800px)] flex-col items-center justify-center px-4 py-16 md:py-24">
          <div className="max-w-4xl text-center">
            {title != null && title.length > 0 && (
              <h1 className="bnb-hero-banner-title">{title}</h1>
            )}
            {subtitle != null && subtitle.length > 0 && (
              <p className="mt-0 font-merriweather text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-md max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
            {hasCta && slide.linkUrl != null && slide.linkLabel != null && (
              <div className="mt-8">
                {isExternalUrl(slide.linkUrl) ? (
                  <a
                    href={slide.linkUrl}
                    className="inline-flex font-montserrat text-lg px-6 py-3 rounded-lg bg-bnb-cyan text-white hover:bg-bnb-light-blue transition-colors shadow-lg"
                    {...externalLinkAttributes}
                  >
                    {slide.linkLabel}
                  </a>
                ) : (
                  <Link
                    href={slide.linkUrl}
                    className="inline-flex font-montserrat text-lg px-6 py-3 rounded-lg bg-bnb-cyan text-white hover:bg-bnb-light-blue transition-colors shadow-lg"
                  >
                    {slide.linkLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <div
              className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2"
              role="tablist"
              aria-label="Slide indicators"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    i === active ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  onClick={() => {
                    setPaused(true);
                    setActive(i);
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Previous slide"
              className="group absolute left-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/50 bg-bnb-dark-blue/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-bnb-dark-blue/75 hover:border-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-bnb-light-blue sm:left-4 md:left-8 md:h-14 md:w-14"
              onClick={() => goManual(-1)}
            >
              <svg
                className="h-7 w-7 transition group-hover:scale-105 md:h-8 md:w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              className="group absolute right-2 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/50 bg-bnb-dark-blue/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-bnb-dark-blue/75 hover:border-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-bnb-light-blue sm:right-4 md:right-8 md:h-14 md:w-14"
              onClick={() => goManual(1)}
            >
              <svg
                className="h-7 w-7 transition group-hover:scale-105 md:h-8 md:w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </section>
    </div>
  );
}
