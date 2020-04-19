import styled from '@emotion/styled';
import { format } from 'date-fns';
import { fromUnixTime } from 'date-fns/esm';
import React from 'react';
import { Entry } from '../Models/Entry';

const Container = styled.div`
  border-bottom: 1px solid #d1d1d1;
  margin-bottom: 15px;
  &:last-child {
    border-bottom: none;
  }
`;

interface Props {
  entry: Entry;
  isHighlighted: boolean;
}

export default ({ entry }: Props) => (
  <Container>
    <h3>{entry.author}</h3>
    <p>{entry.text}</p>
    <h6>{format(fromUnixTime(entry.timestamp), 'dd.MM.yyyy - HH:mm')}</h6>
  </Container>
);
