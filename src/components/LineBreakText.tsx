import { Fragment } from 'preact';

type Props = {
  children: string;
};

export const LineBreakText = ({ children }: Props) => (
  <>
    {children.split('\n').map((item, index) => (
      <Fragment key={index}>
        {item}
        <br />
      </Fragment>
    ))}
  </>
);
