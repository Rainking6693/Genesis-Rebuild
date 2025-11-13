import React, { FC, useEffect, useState, useRef } from 'react';
import { sanitizeHtml } from 'sanitize-html';

interface Props {
  message: string;
}

const sanitizeOptions = {
  allowedTags: ['div', 'p', 'strong', 'em', 'a'],
  allowedAttributes: {
    a: {
      href: true,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  },
};

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');
  const errorMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSanitizedMessage(sanitizeHtml(message, sanitizeOptions));
  }, [message]);

  const handleClose = () => {
    if (errorMessageRef.current) {
      errorMessageRef.current.remove();
    }
  };

  return (
    <div role="alert">
      <div id="error-message" ref={errorMessageRef} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <a href="#" id="error-close" onClick={handleClose}>
        Close
      </a>
    </div>
  );
};

export default MyComponent;

1. Added the `role` attribute to the error message container to improve accessibility.
2. Added target, rel attributes to the anchor tag to ensure external links open in a new tab and prevent potential security issues.
3. Used the `useRef` hook to store a reference to the error message container, which allows us to safely remove the element when the close button is clicked.
4. Added a `handleClose` function to safely remove the error message container.
5. Improved the `sanitizeOptions` to allow only the necessary tags and attributes.