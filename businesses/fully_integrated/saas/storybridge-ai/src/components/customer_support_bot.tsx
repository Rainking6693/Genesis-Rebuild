import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { useId } from 'react';

interface Props {
  message: string;
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const botId = useId();

  // Add error handling for message input
  if (!message) {
    setError('Message is required');
    return (
      <div role="alert" aria-live="polite">
        {error}
      </div>
    );
  }

  // Sanitize user input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div id={botId}>
      {error && (
        <div role="alert" aria-live="polite">
          {error}
        </div>
      )}
      <div role="region" aria-labelledby={botId + '-title'} aria-describedby={botId + '-error'}>
        <div id={`${botId}-title`}>Customer Support Bot</div>
        <div id={`${botId}-message`} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default CustomerSupportBot;

import React, { FC, useState } from 'react';
import DOMPurify from 'dompurify';
import { useId } from 'react';

interface Props {
  message: string;
}

const CustomerSupportBot: FC<Props> = ({ message }) => {
  const [error, setError] = useState<string | null>(null);
  const botId = useId();

  // Add error handling for message input
  if (!message) {
    setError('Message is required');
    return (
      <div role="alert" aria-live="polite">
        {error}
      </div>
    );
  }

  // Sanitize user input to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div id={botId}>
      {error && (
        <div role="alert" aria-live="polite">
          {error}
        </div>
      )}
      <div role="region" aria-labelledby={botId + '-title'} aria-describedby={botId + '-error'}>
        <div id={`${botId}-title`}>Customer Support Bot</div>
        <div id={`${botId}-message`} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default CustomerSupportBot;