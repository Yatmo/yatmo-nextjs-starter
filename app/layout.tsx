import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Yatmo Next.js starter', template: '%s · Yatmo starter' },
  description: 'Real estate listing pages with the neighbourhood map, points of interest, travel times and a server-rendered neighbourhood text, powered by Yatmo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <Link href="/" className="brand">Yatmo starter</Link>
          <nav>
            <Link href="/">Listings</Link>
            <a href="https://documentation.yatmo.com" target="_blank" rel="noopener">Yatmo docs</a>
          </nav>
        </header>
        {children}
        <footer className="site">
          Neighbourhood data by <a href="https://yatmo.com" target="_blank" rel="noopener">Yatmo</a>. Starter source on{' '}
          <a href="https://github.com/Yatmo/yatmo-nextjs-starter" target="_blank" rel="noopener">GitHub</a>.
        </footer>
      </body>
    </html>
  );
}
