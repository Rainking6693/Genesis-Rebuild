import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <article aria-label="Backup message" aria-describedby="backup-message-id">
        {sanitizedMessage}
      </article>
      <div id="backup-message-id" style={{ display: 'none' }}>
        {sanitizedMessage}
      </div>
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
  const [sanitizedMessage, setSanitizedMessage] = useState('');

  useEffect(() => {
    if (message) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <article aria-label="Backup message" aria-describedby="backup-message-id">
        {sanitizedMessage}
      </article>
      <div id="backup-message-id" style={{ display: 'none' }}>
        {sanitizedMessage}
      </div>
    </div>
  );
};

export default MyComponent;