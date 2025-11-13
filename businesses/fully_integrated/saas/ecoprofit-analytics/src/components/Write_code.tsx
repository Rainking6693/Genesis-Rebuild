import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

type Props = PropsWithChildren<{
  message?: string;
  className?: string;
  role?: string;
}>;

const MyComponent: FC<Props> = ({ children, className, role }) => {
  const sanitizedChildren = DOMPurify.sanitize(children as string);

  return (
    <div className={className} role={role}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Default Message',
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

type Props = PropsWithChildren<{
  message?: string;
  className?: string;
  role?: string;
}>;

const MyComponent: FC<Props> = ({ children, className, role }) => {
  const sanitizedChildren = DOMPurify.sanitize(children as string);

  return (
    <div className={className} role={role}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedChildren }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'Default Message',
};

export default MyComponent;