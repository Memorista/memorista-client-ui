import React, { FormEvent } from 'react';

interface Props {
  author: string;
  onChangeAuthor: (author: string) => void;
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: ((event: FormEvent<HTMLFormElement>) => void) | undefined;
}

export default ({ author, onChangeAuthor, text, onChangeText, onSubmit }: Props) => (
  <div className="card my-4">
    <h5 className="card-header">Leave a comment:</h5>
    <div className="card-body">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="author">Name</label>
          <input
            className="form-control"
            type="text"
            id="author"
            placeholder="e.g. Jon Doe"
            value={author}
            onChange={(e) => onChangeAuthor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Text</label>
          <textarea
            className="form-control"
            id="text"
            rows={3}
            placeholder="Hi from Jon Doe"
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  </div>
);
