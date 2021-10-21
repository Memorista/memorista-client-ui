import { useEffect, useState } from 'preact/hooks';
import useFetch from 'use-http';
import { Entry, NewEntry } from '../models/entry';
import { Guestbook } from '../models/guestbook';
import { byCreationTimestamp } from './entry-sort-functions';

export const useGuestbook = (apiKey: string) => {
  const [guestbook, setGuestbook] = useState<Guestbook>();
  const [request, response] = useFetch();

  useEffect(() => {
    (async () => {
      const data: Guestbook[] = await request.get('/guestbooks');

      if (!response.ok || !data.length) {
        setGuestbook(undefined);
        console.error('Memorista: Failed to fetch guestbook. Make sure your API key is correct.');
        return;
      }

      setGuestbook(data[0]);
    })();
  }, [request, response, apiKey]);

  return {
    guestbook,
    isLoading: request.loading,
    error: request.error,
  };
};

export const useEntries = (guestbookId: string | undefined, authorToken: string) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [request, response] = useFetch({ headers: { 'X-Author-Token': authorToken } });

  const createEntry = async (entry: NewEntry) => {
    if (!guestbookId) {
      throw new Error('Memorista: No guestbook ID provided.');
    }

    const newEntry: Entry = await request.post(`/guestbooks/${guestbookId}/entries`, entry);
    if (!response.ok) {
      throw new Error('Memorista: Failed to create entry.');
    }

    setEntries([newEntry, ...entries]);
    return newEntry;
  };

  const updateEntry = async (entryId: Entry['id'], updates: Partial<NewEntry>) => {
    if (!guestbookId) {
      throw new Error('Memorista: No guestbook ID provided.');
    }

    const updatedEntry: Entry = await request.patch(`/guestbooks/${guestbookId}/entries/${entryId}`, updates);
    if (!response.ok) {
      throw new Error('Memorista: Failed to update entry.');
    }

    setEntries(entries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    return updatedEntry;
  };

  useEffect(() => {
    (async () => {
      if (!guestbookId) {
        setEntries([]);
        return;
      }

      const data: Entry[] = await request.get(`/guestbooks/${guestbookId}/entries`);
      if (!response.ok) {
        throw new Error('Memorista: Failed to fetch entries.');
      }

      setEntries(data.sort(byCreationTimestamp));
    })();
  }, [request, response, guestbookId]);

  return {
    entries,
    createEntry,
    updateEntry,
    isLoading: request.loading,
    error: request.error,
  };
};
