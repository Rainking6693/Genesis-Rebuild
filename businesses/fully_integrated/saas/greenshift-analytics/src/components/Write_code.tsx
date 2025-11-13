import React, { FC, DefaultProps, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultProps {
  message?: string;
  title?: string;
  isError?: boolean;
}

const MyComponent: FC<Props> = ({ message, title, isError = false }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  const componentTitle = title || (isError ? 'Error' : 'Message');

  return (
    <div role={isError ? 'alert' : 'status'} aria-label={componentTitle}>
      <div className={`my-component ${isError ? 'error' : ''}`}>
        {sanitizedMessage}
      </div>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  title: '',
};

export default MyComponent;

import React, { FC, DefaultProps, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultProps {
  message?: string;
  title?: string;
  isError?: boolean;
}

const MyComponent: FC<Props> = ({ message, title, isError = false }: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  const componentTitle = title || (isError ? 'Error' : 'Message');

  return (
    <div role={isError ? 'alert' : 'status'} aria-label={componentTitle}>
      <div className={`my-component ${isError ? 'error' : ''}`}>
        {sanitizedMessage}
      </div>
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  title: '',
};

export default MyComponent;