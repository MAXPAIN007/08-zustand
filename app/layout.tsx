import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import 'modern-normalize';
import { Toaster } from 'react-hot-toast';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import css from '@/app/Home.module.css';
import getBaseUrl from '@/lib/api';

const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto', 
  display: 'swap',  
});


export const metadata: Metadata = {
  metadataBase: new URL (getBaseUrl()),
  title: 'Note Hub',
  description: 'Manage your own notes',
  openGraph: {
    title: `Note Hub`,
    description: 'Manage your own notes',
    url: getBaseUrl(),
    siteName: 'NoteHub',
    images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note Hub is your dream for managing notes',
        },
    ],
    type: 'article',     
  }
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <Toaster position="top-center" />
        <TanStackProvider>
          <Header />
          <main className={css.main}>
            {children}
            {modal}
          </main>
          <Footer />
          <ReactQueryDevtools initialIsOpen={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}
