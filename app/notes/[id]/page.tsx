import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';
import { fetchGetNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NoteDetailsProps):Promise<Metadata> {
  const { id } = await params;
  const noteById = await fetchGetNoteById(id)
  const path = `/notes/${encodeURIComponent(id)}`;
  return {
    title: `Note: ${noteById.id}`,
    description: `Page with filtered notes by tag: ${noteById.id}`,
    openGraph: {
      title: `Note: ${noteById.tag || 'All'}`,
      description: `Page with note by ID: ${noteById.id}`,      
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

export default async function NotePage({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchGetNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
