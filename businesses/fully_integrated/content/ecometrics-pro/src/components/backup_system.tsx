import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    // Sanitize the message to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  // Handle empty message
  if (!sanitizedMessage) {
    return <div>No backup message available</div>;
  }

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="alert" className="backup-message">
        {/* Add ARIA attributes for accessibility */}
        <span className="visually-hidden">Backup message:</span>
        <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>

      {/* Add ARIA attributes for accessibility */}
      <div aria-label={`Backup message: ${message}`} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  useEffect(() => {
    // Sanitize the message to prevent XSS attacks
    const sanitized = DOMPurify.sanitize(message);
    setSanitizedMessage(sanitized);
  }, [message]);

  // Handle empty message
  if (!sanitizedMessage) {
    return <div>No backup message available</div>;
  }

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="alert" className="backup-message">
        {/* Add ARIA attributes for accessibility */}
        <span className="visually-hidden">Backup message:</span>
        <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>

      {/* Add ARIA attributes for accessibility */}
      <div aria-label={`Backup message: ${message}`} />
    </div>
  );
};

export default MyComponent;