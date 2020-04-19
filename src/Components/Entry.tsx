import { format } from 'date-fns';
import { fromUnixTime } from 'date-fns/esm';
import React from 'react';
import { Entry } from '../Models/Entry';
import classNames from 'classnames';

interface Props {
  entry: Entry;
  isHighlighted: boolean;
}

export default ({ entry, isHighlighted }: Props) => (
  <div className={classNames('media mb-4', isHighlighted && 'bg-light')}>
    <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt="" />
    <div className="media-body">
      <h5 className="mt-0">{entry.author}</h5>
      <p>{entry.text}</p>
      <h6>{format(fromUnixTime(entry.timestamp), 'dd.MM.yyyy - HH:mm')}</h6>
    </div>
    {isHighlighted && (
      <div>
        <span className="badge badge-success">Your comment</span>
      </div>
    )}
  </div>
);
