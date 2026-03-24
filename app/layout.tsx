import { Analytics } from './Analytics';
import { LayoutSwitcher } from './LayoutSwitcher';
import { logoTypes, siteInfo } from './lib/constants';
import {
  Merriweather,
  Montserrat,
} from 'next/font/google';
import './globals.css';
import './globals.scss';
import type { ReactNode } from 'react';

const merriweather = Merriweather({ weight: '400', subsets: ['latin'], variable: '--font-merriweather' });
const montserrat = Montserrat({ weight: '400', subsets: ['latin'], variable: '--font-montserrat' });

export const viewport = {
  themeColor: '#000000',
};

export const metadata = {
  title: siteInfo.name,
  description: siteInfo.description,
  openGraph: {
    url: siteInfo.url,
  },
  icons: {
    icon: logoTypes.colorSymbol,
    apple: logoTypes.colorSymbol,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`bg-white ${merriweather.variable} ${montserrat.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
            `,
          }}
        />
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col">
        <Analytics />
        <LayoutSwitcher>{children}</LayoutSwitcher>
      </body>
    </html>
  );
}
