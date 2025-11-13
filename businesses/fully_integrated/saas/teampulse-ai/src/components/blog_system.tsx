import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  message: string;
}

interface SanitizedMessage {
  __html: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage | null>(null);

  useEffect(() => {
    if (!message) {
      throw new Error('Message is required');
    }

    const sanitize = (input: string): string => {
      // Remove HTML tags
      const tagFree = input.replace(/<[^>]*>/g, '');

      // Decode HTML entities
      const decoded = tagFree.replace(/&([a-zA-Z]{1,5})?;/g, (match, entity) => {
        const decoder = ENTITY_DECODERS[entity];
        return decoder || match;
      });

      return decoded;
    };

    const sanitizedMessage = sanitize(message);
    setSanitizedMessage({ __html: sanitizedMessage });
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Loading...</div>;
  }

  return (
    <article className="blog-post" data-testid="blog-post">
      <div key={sanitizedMessage.__html} dangerouslySetInnerHTML={sanitizedMessage} aria-label="Blog post content"></div>
    </article>
  );
};

const ENTITY_DECODERS = {
  'amp': '&',
  'lt': '<',
  'gt': '>',
  'quot': '"',
  'apos': "'"
};

export default MyComponent;

import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  message: string;
}

interface SanitizedMessage {
  __html: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage | null>(null);

  useEffect(() => {
    if (!message) {
      throw new Error('Message is required');
    }

    const sanitize = (input: string): string => {
      // Remove HTML tags
      const tagFree = input.replace(/<[^>]*>/g, '');

      // Decode HTML entities
      const decoded = tagFree.replace(/&([a-zA-Z]{1,5})?;/g, (match, entity) => {
        const decoder = ENTITY_DECODERS[entity];
        return decoder || match;
      });

      return decoded;
    };

    const sanitizedMessage = sanitize(message);
    setSanitizedMessage({ __html: sanitizedMessage });
  }, [message]);

  if (!sanitizedMessage) {
    return <div>Loading...</div>;
  }

  return (
    <article className="blog-post" data-testid="blog-post">
      <div key={sanitizedMessage.__html} dangerouslySetInnerHTML={sanitizedMessage} aria-label="Blog post content"></div>
    </article>
  );
};

const ENTITY_DECODERS = {
  'amp': '&',
  'lt': '<',
  'gt': '>',
  'quot': '"',
  'apos': "'"
};

export default MyComponent;