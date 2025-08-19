import css from '@/app/Home.module.css';
import getBaseUrl from '@/lib/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found - Error 404',
  description: 'The page you are looking for does not exist',
  openGraph: {
    title: 'Page not found - Error 404',
    description: 'The page you are looking for does not exist',
    url: `${getBaseUrl()}/note-found`, 
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub is your dream for managing notes',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
