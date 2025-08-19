'use client';
import css from './NoteDetails.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchGetNoteById } from '@/lib/api';

type RouteParams = { id: string };

export default function NoteDetailsClient() {
  const { id } = useParams<RouteParams>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchGetNoteById(id),
    refetchOnMount: false,
    enabled: !!id,
    staleTime: 60_000,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <button className={css.backLink} onClick={handleClose}>
              ← Back
            </button>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
}
