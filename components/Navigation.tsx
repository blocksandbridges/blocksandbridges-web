'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { externalLinkAttributes, logoTypes } from "@/app/lib/constants";
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type SubMenuItem = {
  label: string;
  href?: string;
  submenu?: SubMenuItem[];
};

type NavItem = {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
};

type NavigationApiItem = {
  id: string;
  label: string;
  href: string;
  group: 'main' | 'about-us' | 'about-fasd' | 'events';
  order: number;
};

const staticAboutSubmenu: SubMenuItem[] = [
  { href: "/team", label: "Team" },
];

const staticEventsSubmenu: SubMenuItem[] = [
  { href: "https://inkandverse.eventbrite.ca/", label: "Ink and Verse Fundraiser" },
  { href: "/events", label: "Past Events" },
];

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function MobileSubmenuLeaf({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  const base =
    'block w-full px-4 py-2.5 text-left text-sm font-montserrat text-bnb-dark-blue border-b border-bnb-light-blue/15 last:border-b-0 hover:bg-bnb-light-blue/10';
  if (isExternalHref(href)) {
    return (
      <a href={href} className={base} {...externalLinkAttributes} onClick={onNavigate}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={base} onClick={onNavigate}>
      {label}
    </Link>
  );
}

function MobileSubmenuTree({
  items,
  onNavigate,
}: {
  items: SubMenuItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="rounded-md border border-bnb-light-blue/40 bg-white shadow-inner">
      {items.map((item, index) => {
        if (item.submenu != null && item.submenu.length > 0) {
          return (
            <div key={`${item.label}-nested-${index}`} className="border-b border-bnb-light-blue/15 last:border-b-0">
              <div className="px-4 py-2 text-xs font-montserrat font-semibold uppercase tracking-wide text-bnb-dark-blue/70">
                {item.label}
              </div>
              <div className="pb-1">
                {item.submenu.map((nested) => (
                  <MobileSubmenuLeaf
                    key={`${item.label}-${nested.label}`}
                    href={nested.href ?? '#'}
                    label={nested.label}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          );
        }
        if (item.href != null) {
          return (
            <MobileSubmenuLeaf
              key={`${item.href}-${item.label}-${index}`}
              href={item.href}
              label={item.label}
              onNavigate={onNavigate}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavigationApiItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedHref, setMobileExpandedHref] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/navigation', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: NavigationApiItem[] }) => setNavItems(data.items || []))
      .catch(() => setNavItems([]));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedHref(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (pathname == null) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navLinks = useMemo<NavItem[]>(() => {
    const aboutUsItems = navItems
      .filter((item) => item.group === 'about-us')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ href: item.href, label: item.label }));

    const aboutFasdItems = navItems
      .filter((item) => item.group === 'about-fasd')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ href: item.href, label: item.label }));

    const eventsItems = navItems
      .filter((item) => item.group === 'events')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ href: item.href, label: item.label }));

    const mainItems = navItems
      .filter((item) => item.group === 'main')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ href: item.href, label: item.label }));

    return [
      { href: "/", label: "Home" },
      {
        href: "/about-us",
        label: "About Us",
        submenu: [...aboutUsItems, ...staticAboutSubmenu],
      },
      {
        href: "/what-is-fasd",
        label: "About FASD",
        submenu: [...aboutFasdItems],
      },
      {
        href: "/events",
        label: "Events",
        submenu: [...eventsItems, ...staticEventsSubmenu],
      },
      ...mainItems,
      { href: "/contact", label: "Contact" },
    ];
  }, [navItems]);

  const closeMobile = () => {
    setMobileMenuOpen(false);
    setMobileExpandedHref(null);
  };

  return (
    <nav className="bnb-nav-bar shadow-lg" aria-label="Primary">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-0">
        <div className="flex items-center justify-between gap-3 w-full min-h-[3.25rem]">
          <Link href="/" className="flex items-center shrink min-w-0" onClick={closeMobile}>
            <Image
              src={logoTypes.colorComboMarkWide}
              alt="Blocks and Bridges"
              className="h-auto w-[min(100%,13.5rem)] sm:w-52 lg:w-60"
              width={400}
              height={400}
              priority
            />
          </Link>

          {/* Desktop: unchanged hover + dropdown behaviour */}
          <div className="hidden lg:flex bnb-nav-item shrink-0">
            {navLinks.map(({ href, label, submenu }) => {
              const active = isActive(href);
              return (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'inline-flex items-center gap-1 text-gray-200 no-underline hover:text-gray-400 focus:text-gray-600'
                        : 'bnb-link inline-flex items-center gap-1'
                    }
                  >
                    {label}
                    {submenu != null && submenu.length > 0 && (
                      <span
                        aria-hidden="true"
                        className="text-xs leading-none transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
                      >
                        ▼
                      </span>
                    )}
                  </Link>
                  {submenu != null && submenu.length > 0 && (
                    <div className="absolute left-0 top-full z-50 pt-2 opacity-0 pointer-events-none translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
                      <div className="min-w-[220px] rounded-md border border-bnb-light-blue bg-white text-bnb-dark-blue shadow-xl">
                        {submenu.map((item, index) => (
                          item.submenu != null && item.submenu.length > 0 ? (
                            <div key={`${item.label}-submenu-${index}`} className="relative group/item">
                              <div className="text-sm px-4 py-2 text-bnb-dark-blue flex items-center justify-between cursor-default">
                                <span>{item.label}</span>
                                <span
                                  aria-hidden="true"
                                  className="text-xs leading-none transition-transform duration-150 group-hover/item:translate-x-0.5"
                                >
                                  ▶
                                </span>
                              </div>
                              <div className="absolute left-full top-0 ml-1 min-w-[180px] rounded-md border border-bnb-light-blue bg-white text-bnb-dark-blue shadow-xl opacity-0 pointer-events-none translate-x-1 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:pointer-events-auto group-hover/item:translate-x-0 group-focus-within/item:opacity-100 group-focus-within/item:pointer-events-auto group-focus-within/item:translate-x-0">
                                {item.submenu.map((nestedItem) => (
                                  <div
                                    key={`${item.label}-${nestedItem.label}`}
                                    className="text-sm block px-4 py-2 text-bnb-dark-blue"
                                  >
                                    {nestedItem.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              key={`${item.href ?? item.label}-${item.label}-${index}`}
                              href={item.href ?? '#'}
                              className="bnb-submenu-link"
                            >
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <a href="https://www.paypal.com/ncp/payment/8WF6GYS6HXU34" className="bnb-link" {...externalLinkAttributes}>
              Donate
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md border border-white/40 p-2.5 text-white hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-bnb-light-blue"
            aria-expanded={mobileMenuOpen}
            aria-controls="bnb-mobile-nav"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile: full-width sheet, tap accordions (separate from desktop hover UX) */}
        {mobileMenuOpen && (
          <div
            id="bnb-mobile-nav"
            className="lg:hidden border-t border-bnb-light-blue/40 -mx-4 px-4 sm:mx-0 sm:px-0 max-h-[min(75vh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain pb-3"
          >
            <ul className="flex flex-col font-montserrat text-base text-white pt-2">
              {navLinks.map(({ href, label, submenu }) => {
                const active = isActive(href);
                const hasSub = submenu != null && submenu.length > 0;
                const expanded = mobileExpandedHref === href;

                if (!hasSub) {
                  return (
                    <li key={href} className="border-b border-white/15">
                      <Link
                        href={href}
                        aria-current={active ? 'page' : undefined}
                        className={`block py-3.5 pl-1 ${active ? 'text-gray-200' : 'bnb-link'}`}
                        onClick={closeMobile}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={href} className="border-b border-white/15">
                    <div className="flex flex-col gap-2 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={href}
                          className={`bnb-link flex-1 py-1 pl-1 ${active ? 'text-gray-200' : ''}`}
                          onClick={closeMobile}
                        >
                          {label}
                        </Link>
                        <button
                          type="button"
                          className="shrink-0 rounded px-3 py-2 text-white/90 border border-white/25 hover:bg-white/10"
                          aria-expanded={expanded}
                          onClick={() => setMobileExpandedHref((k) => (k === href ? null : href))}
                        >
                          <span className="sr-only">Toggle {label} submenu</span>
                          <span aria-hidden className={`inline-block transition-transform ${expanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>
                      </div>
                      {expanded && (
                        <div className="pl-1 pb-1">
                          <MobileSubmenuTree items={submenu} onNavigate={closeMobile} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
              <li className="pt-2">
                <a
                  href="https://www.paypal.com/ncp/payment/8WF6GYS6HXU34"
                  className="bnb-link inline-block py-3 pl-1 font-semibold"
                  {...externalLinkAttributes}
                  onClick={closeMobile}
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
