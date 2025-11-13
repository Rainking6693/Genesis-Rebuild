import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sanitize = () => {
      if (sanitizedMessageRef.current) {
        sanitizedMessageRef.current.innerHTML = createSanitizedHTML(message);
        sanitizedMessageRef.current.textContent = sanitizedMessageRef.current.textContent || '';
      }
    };

    sanitize();
  }, [message]);

  return (
    <div>
      <div ref={sanitizedMessageRef} />
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Remove script tags to prevent XSS attacks
  const scripts = tempElement.getElementsByTagName('script');
  while (scripts.length > 0) {
    scripts[0].parentNode?.removeChild(scripts[0]);
  }

  return tempElement.textContent || '';
};

export default MyComponent;

import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const sanitize = () => {
      if (sanitizedMessageRef.current) {
        sanitizedMessageRef.current.innerHTML = createSanitizedHTML(message);
        sanitizedMessageRef.current.textContent = sanitizedMessageRef.current.textContent || '';
      }
    };

    sanitize();
  }, [message]);

  return (
    <div>
      <div ref={sanitizedMessageRef} />
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Remove script tags to prevent XSS attacks
  const scripts = tempElement.getElementsByTagName('script');
  while (scripts.length > 0) {
    scripts[0].parentNode?.removeChild(scripts[0]);
  }

  return tempElement.textContent || '';
};

export default MyComponent;