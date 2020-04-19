import { getUnixTime } from 'date-fns';
import React, { FormEvent, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import CreateEntryForm from './Components/CreateEntryForm';
import Entry from './Components/Entry';
import SuccessMessage from './Components/SuccessMessage';
import { useEntries } from './Utils/API';

export default () => {
  const { entries, createEntry, isLoading } = useEntries();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [submittedEntryId, setSubmittedEntryId] = useState(localStorage.getItem('guesty:submittedEntryId'));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newEntry = await createEntry({ author, text, timestamp: getUnixTime(new Date()) });

    if (!newEntry) {
      return;
    }

    setSubmittedEntryId(newEntry.id);
    localStorage.setItem('guesty:submittedEntryId', newEntry.id);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">
          {!submittedEntryId ? (
            <CreateEntryForm
              author={author}
              onChangeAuthor={setAuthor}
              text={text}
              onChangeText={setText}
              onSubmit={onSubmit}
            />
          ) : (
            <SuccessMessage />
          )}
          <hr />
          {isLoading && (
            <div className="loader">
              <SyncLoader />
            </div>
          )}
          <div>
            {entries &&
              entries.map((entry) => (
                <Entry key={entry.id} entry={entry} isHighlighted={entry.id.toString() === submittedEntryId} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
