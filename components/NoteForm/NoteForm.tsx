'use client';

import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useId } from 'react';
import type { NewNoteData } from '../../types/note';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note is created!');
      router.push('/notes/filter/All');
      clearDraft();
    },
    onError: () => {
      toast.error('Failed, try later!');
    },
  });

  const handleSubmit = (
    values: NewNoteData,    
  ) => {
    const newNote: NewNoteData = {
      title: values.title,
      content: values.content,
      tag: values.tag,
    };
    mutation.mutate(newNote);
    setDraft(newNote);
  };

  const handleCancelClick = () => {
    router.back();
  };

   const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {	  
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Formik
      initialValues={draft}
      enableReinitialize      
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isValid, isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              id={`${fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
              onChange={handleChange}
            />
            <ErrorMessage component="span" name="title" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={5}
              className={css.textarea}              
              onChange={handleChange}
            />
            <ErrorMessage
              component="span"
              name="content"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}  onChange={handleChange}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage component="span" name="tag" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
