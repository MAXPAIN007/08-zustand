import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];
  const path = slug?.length ? `/notes/${slug.join('/')}` : '/notes';

  return {
    title: `Notes - ${tag ?? 'All'}`,
    description: tag ? `Browse notes tagged with "${tag}".` : 'Browse all notes.',
    openGraph: {
      title: `Notes - ${tag ?? 'All'}`,
      description: tag ? `Browse notes tagged with "${tag}".` : 'Browse all notes.',
      url: path,
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
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] === 'All' ? undefined : slug?.[0];
  
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', '', 1, tag],           
    queryFn: () => fetchNotes('', 1, tag),     
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={tag} /> 
    </HydrationBoundary>
  );
}