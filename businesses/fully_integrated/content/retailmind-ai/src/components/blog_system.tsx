import React, { useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const sanitize = (message: string) => {
  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(message);
  }

  // Fallback sanitize function for edge cases where DOM Purify is not available
  const div = document.createElement('div');
  div.innerHTML = message;
  return div.textContent;
};

const FunctionalComponent: React.FC<Props> = ({ message }) => {
  const sanitizedMessage = useCallback(sanitize(message), [message]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage} // Add ARIA label for accessibility
      key={sanitizedMessage} // Add key prop for better React performance
    />
  );
};

export default React.memo(FunctionalComponent);

import React, { useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const sanitize = (message: string) => {
  if (DOMPurify.isSupported) {
    return DOMPurify.sanitize(message);
  }

  // Fallback sanitize function for edge cases where DOM Purify is not available
  const div = document.createElement('div');
  div.innerHTML = message;
  return div.textContent;
};

const FunctionalComponent: React.FC<Props> = ({ message }) => {
  const sanitizedMessage = useCallback(sanitize(message), [message]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={sanitizedMessage} // Add ARIA label for accessibility
      key={sanitizedMessage} // Add key prop for better React performance
    />
  );
};

export default React.memo(FunctionalComponent);