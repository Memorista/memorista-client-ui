import React, { FormEvent } from 'react';

interface Props {
  author: string;
  onChangeAuthor: (author: string) => void;
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined;
}

export default ({ author, onChangeAuthor, text, onChangeText, onSubmit }: Props) => (
  <form onSubmit={onSubmit}>
    <fieldset>
      <label htmlFor="author">Name</label>
      <input type="text" id="author" placeholder="e.g. Jon Doe" value={author} onChange={(e) => onChangeAuthor(e.target.value)} />
      <label htmlFor="text">Text</label>
      <textarea id="text" placeholder="Hi from Jon Doe" value={text} onChange={(e) => onChangeText(e.target.value)} />
      <input className="button-primary" type="submit" value="Send" />
    </fieldset>
  </form>
);
