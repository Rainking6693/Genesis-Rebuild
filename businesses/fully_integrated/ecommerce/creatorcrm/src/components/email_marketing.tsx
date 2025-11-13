import React, { FC, ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  subject: string;
  message: ReactNode;
  dataTestid?: string;
}

const MyEmailComponent: FC<Props> = ({ subject, message, className, dataTestid, ...rest }) => {
  return (
    <div data-testid={dataTestid} className={className} {...rest}>
      <h3 role="heading" htmlFor={dataTestid}>{subject}</h3>
      <div role="presentation" tabIndex={0}>{message}</div>
    </div>
  );
};

MyEmailComponent.defaultProps = {
  className: '',
  dataTestid: 'my-email-component',
};

export default MyEmailComponent;

In this updated version, I've added a `dataTestid` prop for easier testing and debugging, and I've extended the `Props` interface to include the `HTMLAttributes` type to allow for more flexibility in the attributes that can be passed to the component. I've also added default values for the `dataTestid` prop and used destructuring to simplify the props handling.