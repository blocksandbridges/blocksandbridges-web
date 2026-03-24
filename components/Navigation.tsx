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

export function Navigation() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavigationApiItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/navigation', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: NavigationApiItem[] }) => setNavItems(data.items || []))
      .catch(() => setNavItems([]));

    return () => controller.abort();
  }, []);

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

  return (
    <nav className="bnb-nav-bar shadow-lg">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={logoTypes.colorComboMarkWide}
            alt="Blocks and Bridges"
            className="w-60 h-auto"
            width={400}
            height={400}
          />
        </Link>
        <div className="bnb-nav-item">
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

          {/* external link stays as <a> */}

          <a href="https://www.paypal.com/ncp/payment/8WF6GYS6HXU34" className="bnb-link" {...externalLinkAttributes}>
            Donate
          </a>
        </div>
      </div>
    </nav>
  );
}
