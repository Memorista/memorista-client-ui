import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { Entry, NewEntry } from '../Models/Entry';

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [request, response] = useFetch();

  const createEntry = async (entry: NewEntry) => {
    const newEntry = await request.post('/entries', entry);

    if (response.ok) {
      setEntries([newEntry, ...entries]);
    }
  };

  useEffect(() => {
    const init = async () => {
      const data = await request.get('/entries?_sort=timestamp&_order=desc');

      if (response.ok) {
        setEntries(data);
      }
    };

    init();
  }, [request, response]);

  return {
    entries,
    createEntry,
    isLoading: request.loading,
    error: request.error,
  };
};
