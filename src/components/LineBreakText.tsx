import { Fragment } from 'preact';
import { FC } from 'react';

interface Props {
  children: string;
}

export const LineBreakText: FC<Props> = ({ children }) => (
  <>
    {children.split('\n').map((item, index) => (
      <Fragment key={index}>
        {item}
        <br />
      </Fragment>
    ))}
  </>
);
