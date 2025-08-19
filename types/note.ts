export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: Tag;
}

export type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
