import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    setSanitizedMessage(DOMPurify.sanitize(inputMessage));
  }, []);

  const sanitizedHTML = useMemo(() => DOMPurify.sanitize(`<div innerHTML="${sanitizedMessage}" />`).firstChild.innerHTML, [sanitizedMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSanitizedMessage(message);
      }
    };

    const handleBlur = () => {
      // Perform additional actions when the input loses focus
    };

    const inputElement = document.querySelector('input');
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [message]);

  return (
    <div>
      <label htmlFor="my-component-input">Message:</label>
      <input
        type="text"
        id="my-component-input"
        value={sanitizedMessage}
        onChange={handleMessageChange}
        aria-describedby="my-component-id"
      />
      <div id="my-component-id">This is a description for the component message.</div>
      <div aria-label="My component message">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMessage = event.target.value;
    setSanitizedMessage(DOMPurify.sanitize(inputMessage));
  }, []);

  const sanitizedHTML = useMemo(() => DOMPurify.sanitize(`<div innerHTML="${sanitizedMessage}" />`).firstChild.innerHTML, [sanitizedMessage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSanitizedMessage(message);
      }
    };

    const handleBlur = () => {
      // Perform additional actions when the input loses focus
    };

    const inputElement = document.querySelector('input');
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [message]);

  return (
    <div>
      <label htmlFor="my-component-input">Message:</label>
      <input
        type="text"
        id="my-component-input"
        value={sanitizedMessage}
        onChange={handleMessageChange}
        aria-describedby="my-component-id"
      />
      <div id="my-component-id">This is a description for the component message.</div>
      <div aria-label="My component message">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
      </div>
    </div>
  );
};

export default MyComponent;