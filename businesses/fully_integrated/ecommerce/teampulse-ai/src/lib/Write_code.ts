import React, { FC, ReactNode, Key, useMemo, useState } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [element, setElement] = useState<ReactNode | null>(null);

  useMemo(() => {
    if (!message) {
      setElement(null);
      return;
    }

    const cleanHtml = new DOMParser().parseFromString(message, 'text/html').body.textContent || '';
    setElement(
      <div key={`my-component-${message}`} dangerouslySetInnerHTML={{ __html: cleanHtml }} aria-label="My Component" />
    );
  }, [message]);

  return React.isValidElement(element) ? element : null;
};

export { MyComponent };

import React, { FC, ReactNode, Key, useMemo, useState } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [element, setElement] = useState<ReactNode | null>(null);

  useMemo(() => {
    if (!message) {
      setElement(null);
      return;
    }

    const cleanHtml = new DOMParser().parseFromString(message, 'text/html').body.textContent || '';
    setElement(
      <div key={`my-component-${message}`} dangerouslySetInnerHTML={{ __html: cleanHtml }} aria-label="My Component" />
    );
  }, [message]);

  return React.isValidElement(element) ? element : null;
};

export { MyComponent };