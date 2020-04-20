import classNames from 'classnames';
import { format } from 'date-fns';
import { fromUnixTime } from 'date-fns/esm';
import React from 'react';
import { Badge, Media } from 'react-bootstrap';
import { Entry } from '../Models/Entry';

interface Props {
  entry: Entry;
  isHighlighted: boolean;
}

export default ({ entry, isHighlighted }: Props) => (
  <Media className={classNames('mb-4', isHighlighted && 'bg-light')}>
    <img className="mr-3" src="http://placehold.it/64x64" alt="" />
    <Media.Body>
      <h5>{entry.author}</h5>
      <p>{entry.text}</p>
      <h6>{format(fromUnixTime(entry.timestamp), 'dd.MM.yyyy - HH:mm')}</h6>
    </Media.Body>
    {isHighlighted && (
      <div>
        <Badge variant="success">Your comment</Badge>
      </div>
    )}
  </Media>
);
