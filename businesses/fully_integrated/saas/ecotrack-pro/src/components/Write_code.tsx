import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message?: string;
  className?: string;
  children?: ReactNode;
}

const sanitize = (html: string) => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent.trim();
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return html;
  }
};

const MyComponent: FC<Props> = ({ message = '', className, children }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [sanitizedChildren, setSanitizedChildren] = useState(children);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (children) {
      setSanitizedChildren(
        React.Children.map(children as React.ReactNode[], (child) => {
          if (typeof child === 'string') {
            return sanitize(child);
          }
          return child;
        })
      );
    }
  }, [children]);

  return (
    <div
      className={className}
      aria-label="My component"
      data-testid="my-component"
      key={sanitizedMessage}
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
      {sanitizedChildren}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message?: string;
  className?: string;
  children?: ReactNode;
}

const sanitize = (html: string) => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent.trim();
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return html;
  }
};

const MyComponent: FC<Props> = ({ message = '', className, children }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const [sanitizedChildren, setSanitizedChildren] = useState(children);

  useEffect(() => {
    if (message) {
      setSanitizedMessage(sanitize(message));
    }
  }, [message]);

  useEffect(() => {
    if (children) {
      setSanitizedChildren(
        React.Children.map(children as React.ReactNode[], (child) => {
          if (typeof child === 'string') {
            return sanitize(child);
          }
          return child;
        })
      );
    }
  }, [children]);

  return (
    <div
      className={className}
      aria-label="My component"
      data-testid="my-component"
      key={sanitizedMessage}
    >
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
      {sanitizedChildren}
    </div>
  );
};

export default MyComponent;