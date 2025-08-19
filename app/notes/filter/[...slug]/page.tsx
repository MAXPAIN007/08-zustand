import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];  
  const path = slug?.length ? `/notes/${slug.join('/')}` : '/notes';
  return {
    title: `Note: ${tag || "All"}`,
    description: `Page with filtered notes by tag: ${tag}`,
    openGraph: {
      title: `Note: ${tag || 'All'}`,
      description: `Page with filtered notes by tag: ${tag}`,
      url: path,
      images: [{
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub is your dream for managing notes',
       }],
    },
  }
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];
  const initialData = await fetchNotes('', 1, tag);

  return <NotesClient initialData={initialData} initialTag={tag} />;
}