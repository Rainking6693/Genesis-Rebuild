import React, { FC, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface ErrorProps {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<ErrorProps | null>(null);

  const sanitizedMessage = useMemo(() => {
    let sanitized: string;

    try {
      sanitized = DOMPurify.sanitize(message);
    } catch (error) {
      setError({ message: `Error sanitizing message: ${error.message}` });
      sanitized = `Error sanitizing message`;
    }

    return sanitized;
  }, [message]);

  return (
    <div className="stresslens-ai-message" aria-live="polite">
      {sanitizedMessage}
      {error && (
        <div className="stresslens-ai-error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

MyComponent.sanitize = (message: string) => {
  let sanitized: string;

  try {
    sanitized = DOMPurify.sanitize(message);
  } catch (error) {
    throw new Error(`Error sanitizing message: ${error.message}`);
  }

  return sanitized;
};

export default MyComponent;

import React, { FC, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface ErrorProps {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState<ErrorProps | null>(null);

  const sanitizedMessage = useMemo(() => {
    let sanitized: string;

    try {
      sanitized = DOMPurify.sanitize(message);
    } catch (error) {
      setError({ message: `Error sanitizing message: ${error.message}` });
      sanitized = `Error sanitizing message`;
    }

    return sanitized;
  }, [message]);

  return (
    <div className="stresslens-ai-message" aria-live="polite">
      {sanitizedMessage}
      {error && (
        <div className="stresslens-ai-error" role="alert">
          {error.message}
        </div>
      )}
    </div>
  );
};

MyComponent.sanitize = (message: string) => {
  let sanitized: string;

  try {
    sanitized = DOMPurify.sanitize(message);
  } catch (error) {
    throw new Error(`Error sanitizing message: ${error.message}`);
  }

  return sanitized;
};

export default MyComponent;