import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Terminal } from '@/components/terminal/Terminal';
import { ModeProvider } from '@/context/ModeContext';
import '@/app/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bri Workman — Software Engineer',
  description:
    'Frontend-focused software engineer building with AI. Explore my projects, writing, and workflow.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-bg text-text-primary antialiased">
        <ModeProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
          <Footer />
          <Terminal />
        </ModeProvider>
      </body>
    </html>
  );
}
