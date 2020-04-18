import { useEffect, useState, useCallback } from 'react';
import useFetch from 'use-http';
import { Entry, NewEntry } from '../Models/Entry';

export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [request, response] = useFetch();

  const createEntry = async (entry: NewEntry) => {
    const newEntry = await request.post('/entries', entry);

    if (response.ok) {
      setEntries([...entries, newEntry]);
    }
  };

  const init = useCallback(async () => {
    const data = await request.get('/entries?_sort=timestamp&_order=desc');
    if (response.ok) setEntries(data);

    // TODO: finally find out what this is all about
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return {
    entries,
    createEntry,
    isLoading: request.loading,
    error: request.error,
  };
};
