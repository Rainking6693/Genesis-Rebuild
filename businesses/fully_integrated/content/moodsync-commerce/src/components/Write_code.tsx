import React, { FC, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
};

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [ariaLabel, setAriaLabel] = useState(message || '');

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Set the innerHTML of the div safely
  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  // Update the ARIA-label when the message changes
  React.useEffect(() => {
    setAriaLabel(sanitizedMessage);
  }, [sanitizedMessage]);

  return (
    <div ref={divRef} aria-label={ariaLabel}>
      {/* Add any additional components or styling here */}
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

type Props = {
  message: string;
};

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [ariaLabel, setAriaLabel] = useState(message || '');

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Set the innerHTML of the div safely
  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  // Update the ARIA-label when the message changes
  React.useEffect(() => {
    setAriaLabel(sanitizedMessage);
  }, [sanitizedMessage]);

  return (
    <div ref={divRef} aria-label={ariaLabel}>
      {/* Add any additional components or styling here */}
    </div>
  );
};

export default MyComponent;