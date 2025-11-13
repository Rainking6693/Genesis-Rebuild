import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { useErrorMessage } from './useErrorMessage';

interface Props {
  id?: string;
}

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'strong', 'em', 'a'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
};

const MyComponent: FC<Props> = ({ id }) => {
  const errorMessage = useErrorMessage(id);

  return (
    <div data-testid="error-message" id={id}>
      <p>An error occurred:</p>
      <div
        dangerouslySetInnerHTML={{
          __html: errorMessage || '',
        }}
      />
    </div>
  );
};

export default MyComponent;

// useErrorMessage.ts
import { useCallback, useEffect, useState } from 'react';

type ErrorMessage = string | null;

export const useErrorMessage = (id?: string) => {
  const [message, setMessage] = useState<ErrorMessage>(null);

  const sanitizeOptions = {
    allowedTags: ['div', 'p', 'strong', 'em', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  };

  const sanitize = useCallback(
    (html: string) => sanitizeHtml(html, sanitizeOptions),
    [sanitizeOptions]
  );

  useEffect(() => {
    if (!id) return;

    const errorElement = document.getElementById(id);

    if (!errorElement) return;

    const errorMessage = errorElement.innerText;

    if (!errorMessage) return;

    setMessage(sanitize(errorMessage));
  }, [id, sanitize]);

  return message;
};

import React, { FC, useEffect, useState } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import { useErrorMessage } from './useErrorMessage';

interface Props {
  id?: string;
}

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'strong', 'em', 'a'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
};

const MyComponent: FC<Props> = ({ id }) => {
  const errorMessage = useErrorMessage(id);

  return (
    <div data-testid="error-message" id={id}>
      <p>An error occurred:</p>
      <div
        dangerouslySetInnerHTML={{
          __html: errorMessage || '',
        }}
      />
    </div>
  );
};

export default MyComponent;

// useErrorMessage.ts
import { useCallback, useEffect, useState } from 'react';

type ErrorMessage = string | null;

export const useErrorMessage = (id?: string) => {
  const [message, setMessage] = useState<ErrorMessage>(null);

  const sanitizeOptions = {
    allowedTags: ['div', 'p', 'strong', 'em', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  };

  const sanitize = useCallback(
    (html: string) => sanitizeHtml(html, sanitizeOptions),
    [sanitizeOptions]
  );

  useEffect(() => {
    if (!id) return;

    const errorElement = document.getElementById(id);

    if (!errorElement) return;

    const errorMessage = errorElement.innerText;

    if (!errorMessage) return;

    setMessage(sanitize(errorMessage));
  }, [id, sanitize]);

  return message;
};