import { format, fromUnixTime, getUnixTime } from 'date-fns';
import React, { FormEvent, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import './App.css';
import { useEntries } from './Utils/API';

export default () => {
  const { entries, createEntry, isLoading } = useEntries();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createEntry({ author, text, timestamp: getUnixTime(new Date()) });
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="author">Name</label>
          <input
            type="text"
            id="author"
            placeholder="e.g. Jon Doe"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="text">Text</label>
          <textarea id="text" placeholder="Hi from Jon Doe" value={text} onChange={(e) => setText(e.target.value)} />
          <input className="button-primary" type="submit" value="Send" />
        </fieldset>
      </form>
      {isLoading && (
        <div className="loader">
          <SyncLoader />
        </div>
      )}
      <div>
        {entries &&
          entries.map((entry) => (
            <div className="entry" key={entry.id}>
              <h3>{entry.author}</h3>
              <p>{entry.text}</p>
              <h6>{format(fromUnixTime(entry.timestamp), 'dd.MM.yyyy - HH:mm')}</h6>
            </div>
          ))}
      </div>
    </div>
  );
};
