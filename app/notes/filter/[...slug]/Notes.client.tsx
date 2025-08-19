'use client';

import css from './Notes.module.css';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';

import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';


import { fetchNotes } from '@/lib/api';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { FetchNotesResponse } from '@/lib/api';

interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialTag: string | undefined;
}

export default function NotesClient({ initialData,initialTag }: NotesClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage, initialTag],
    queryFn: () => fetchNotes(debouncedSearchValue, currentPage, initialTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData:
      debouncedSearchValue === '' && currentPage === 1
        ? initialData
        : undefined,
  });

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const handleCreateNote = () => {
    router.push('/notes/action/create');
  };

  

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleCreateNote}>
          Create Note +
        </button>
      </div>
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {data && isSuccess && (
        <>
          {data.notes.length > 0 ? (
            <NoteList notes={data.notes} />
          ) : (
            <div className={css.emptyState}>
              <p>No notes found. Create your first note!</p>
            </div>
          )}
        </>
      )}      
    </div>
  );
}