import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Webflow Developer & Designer | GSAP Motion | NBNZIA',
  description: 'Webflow developer with 7+ years of experience, a team of designers, animators, and strategists behind me, and a past life as a professional illusionist.',
  openGraph: {
    title: 'Webflow Developer & Designer | GSAP Motion | NBNZIA',
    description: 'Webflow developer with 7+ years of experience, a team of designers, animators, and strategists.',
    url: 'https://www.nbnzia.com',
    siteName: 'NBNZIA',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
