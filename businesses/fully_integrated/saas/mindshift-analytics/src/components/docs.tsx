import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  name?: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ name = '', onError }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!name || typeof name !== 'string') {
      setError(new Error('Name prop is required and must be a string'));
      if (onError) onError(new Error('Name prop is required and must be a string'));
      return;
    }

    setError(null);
  }, [name, onError]);

  const sanitizeText = (text: string) => {
    return DOMPurify.sanitize(text);
  };

  if (error) {
    return (
      <div role="alert" data-testid="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <h1 className="text-2xl font-bold" data-testid="greeting">
      Hello, {sanitizeText(name)}!
    </h1>
  );
};

export default MyComponent;

import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  name?: string;
  onError?: (error: Error) => void;
}

const MyComponent: React.FC<Props> = ({ name = '', onError }) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!name || typeof name !== 'string') {
      setError(new Error('Name prop is required and must be a string'));
      if (onError) onError(new Error('Name prop is required and must be a string'));
      return;
    }

    setError(null);
  }, [name, onError]);

  const sanitizeText = (text: string) => {
    return DOMPurify.sanitize(text);
  };

  if (error) {
    return (
      <div role="alert" data-testid="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <h1 className="text-2xl font-bold" data-testid="greeting">
      Hello, {sanitizeText(name)}!
    </h1>
  );
};

export default MyComponent;