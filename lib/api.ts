import axios from 'axios';
import type { NewNoteData, Note } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Params {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

const myKey = process.env.NEXT_PUBLIC_NOTES_TOKEN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
const notesUrl = `${baseUrl}/notes`;

export default function getBaseUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL; 
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000'; 
}

export async function fetchNotes(
  searchValue: string = '',
  page: number = 1,
  tag?: string,
  perPage: number = 12
): Promise<FetchNotesResponse> {
  const params: Params = {
    page,
    perPage,
    tag,
  };

  if (searchValue) {
    params.search = searchValue;
  }

  const response = await axios.get<FetchNotesResponse>(`${notesUrl}`, {
    params,
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
}


export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await axios.post<Note>(`${notesUrl}`, noteData, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${notesUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};

export async function fetchGetNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${notesUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
}
