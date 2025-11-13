import React, { FC, useEffect, useState, useMemo } from 'react';

interface Props {
  message: string;
  isTrusted?: boolean; // Added to handle user-supplied content
}

const sanitizeHtml = (unsafeHtml: string): string => {
  let sanitizedHtml = '';
  try {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = unsafeHtml;
    sanitizedHtml = tempElement.textContent;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    sanitizedHtml = 'Error sanitizing message';
  }
  return sanitizedHtml;
};

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  const sanitizedMessage = useMemo(() => {
    if (isTrusted) {
      return message;
    }
    return sanitizeHtml(message);
  }, [isTrusted, message]);

  useEffect(() => {
    if (sanitizedMessage !== safeMessage) {
      setSafeMessage(sanitizedMessage);
    }
  }, [sanitizedMessage]);

  return (
    <div>
      {/* Added ARIA attributes for accessibility */}
      <article aria-label={`Message: ${safeMessage}`} role="presentation">
        {safeMessage && (
          <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
        )}
        {!safeMessage && <div>Error sanitizing message</div>}
      </article>
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState, useMemo } from 'react';

interface Props {
  message: string;
  isTrusted?: boolean; // Added to handle user-supplied content
}

const sanitizeHtml = (unsafeHtml: string): string => {
  let sanitizedHtml = '';
  try {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = unsafeHtml;
    sanitizedHtml = tempElement.textContent;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    sanitizedHtml = 'Error sanitizing message';
  }
  return sanitizedHtml;
};

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  const sanitizedMessage = useMemo(() => {
    if (isTrusted) {
      return message;
    }
    return sanitizeHtml(message);
  }, [isTrusted, message]);

  useEffect(() => {
    if (sanitizedMessage !== safeMessage) {
      setSafeMessage(sanitizedMessage);
    }
  }, [sanitizedMessage]);

  return (
    <div>
      {/* Added ARIA attributes for accessibility */}
      <article aria-label={`Message: ${safeMessage}`} role="presentation">
        {safeMessage && (
          <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
        )}
        {!safeMessage && <div>Error sanitizing message</div>}
      </article>
    </div>
  );
};

export default MyComponent;