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

export const useEntries = (guestbookId: string | undefined) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [request, response] = useFetch();

  const createEntry = async (entry: NewEntry) => {
    if (!guestbookId) {
      return null;
    }

    const newEntry: Entry = await request.post(`/guestbooks/${guestbookId}/entries`, entry);

    if (!response.ok) {
      return null;
    }

    setEntries([newEntry, ...entries]);
    return newEntry;
  };

  useEffect(() => {
    (async () => {
      if (!guestbookId) {
        setEntries([]);
        return;
      }

      const data: Entry[] = await request.get(`/guestbooks/${guestbookId}/entries`);

      if (!response.ok) {
        return;
      }

      setEntries(data.sort(byCreationTimestamp));
    })();
  }, [request, response, guestbookId]);

  return {
    entries,
    createEntry,
    isLoading: request.loading,
    error: request.error,
  };
};
