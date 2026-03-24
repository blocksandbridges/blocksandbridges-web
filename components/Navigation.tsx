'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { externalLinkAttributes, logoTypes } from "@/app/lib/constants";
import Image from 'next/image';

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

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About FASD",
    submenu: [
      { href: "/mission-and-vision", label: "Mission and Vision" },
      { href: "/brands", label: "Why We Started" },
      { href: "/team", label: "Team" },
      {
        label: "What is FASD?",
        submenu: [
          { label: "Strengths" },
          { label: "Challenges" },
        ],
      },
      { href: "/contact", label: "Supporting Individuals Experiencing FASD" },
    ],
  },
  { href: "/brands", label: "Our Pillars" },
  {
    href: "/blog",
    label: "Events",
    submenu: [
      { href: "/blog", label: "Upcoming Events" },
      { href: "/portfolio", label: "Past Work" },
      { href: "/contact", label: "Book Us" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (pathname == null) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

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
                    <div className="min-w-[220px] rounded-md border border-bnb-light-blue bg-white shadow-xl">
                      {submenu.map((item) => (
                        item.submenu != null && item.submenu.length > 0 ? (
                          <div key={`${item.label}-submenu`} className="relative group/item">
                            <div className="text-sm px-4 py-2 text-bnb-dark-blue flex items-center justify-between cursor-default">
                              <span>{item.label}</span>
                              <span
                                aria-hidden="true"
                                className="text-xs leading-none transition-transform duration-150 group-hover/item:translate-x-0.5"
                              >
                                ▶
                              </span>
                            </div>
                            <div className="absolute left-full top-0 ml-1 min-w-[180px] rounded-md border border-bnb-light-blue bg-white shadow-xl opacity-0 pointer-events-none translate-x-1 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:pointer-events-auto group-hover/item:translate-x-0 group-focus-within/item:opacity-100 group-focus-within/item:pointer-events-auto group-focus-within/item:translate-x-0">
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
                            key={`${item.href ?? item.label}-${item.label}`}
                            href={item.href ?? '#'}
                            className="text-sm block px-4 py-2 text-bnb-dark-blue no-underline hover:bg-bnb-light-blue/10 hover:text-bnb-light-blue focus:bg-bnb-light-blue/10 focus:text-bnb-light-blue"
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

          <a href="https://shop.dragonspurr.ca" className="bnb-link" {...externalLinkAttributes}>
            Shop
          </a>
        </div>
      </div>
    </nav>
  );
}
