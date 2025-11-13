import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string;
  message?: string;
}

const MyComponent: FC<Props> = ({ className, id, ...rest }) => {
  const defaultSubject = 'Untitled Email';
  const defaultMessage = '';

  return (
    <div className={className} {...rest} id={id || 'email-container'}>
      <h2 id="email-subject" aria-level={2}>{subject || defaultSubject}</h2>
      <div id="email-content" aria-describedby="email-subject">{message || defaultMessage}</div>
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string;
  message?: string;
}

const MyComponent: FC<Props> = ({ className, id, ...rest }) => {
  const defaultSubject = 'Untitled Email';
  const defaultMessage = '';

  return (
    <div className={className} {...rest} id={id || 'email-container'}>
      <h2 id="email-subject" aria-level={2}>{subject || defaultSubject}</h2>
      <div id="email-content" aria-describedby="email-subject">{message || defaultMessage}</div>
    </div>
  );
};

export default MyComponent;