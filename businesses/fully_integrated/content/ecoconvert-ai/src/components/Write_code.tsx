import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitize } from 'dompurify';

interface LinkAttributes {
  href?: string;
  target?: string;
}

interface InlineElementAttributes {
  'data-testid'?: string;
}

interface Props extends PropsWithChildren<{
  message?: string;
}> {
  id?: string;
  testId?: string;
}

const MyComponent: FC<Props> = ({ children, message, id, testId }) => {
  const sanitizedMessage = sanitize(message || '', {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a'],
    ALLOWED_ATTRS: {
      a: ['href', 'target'],
      '*': ['data-testid'],
    },
  });

  const linkAttributes: LinkAttributes = {
    target: '_blank', // Default target for links
  };

  // Extract links from sanitizedMessage and apply attributes
  const links = sanitizedMessage.match(/<a\s[^>]*>([^<]+)<\/a>/g);
  if (links) {
    links.forEach((link) => {
      const href = link.match(/href="([^"]+)"/);
      if (href) {
        linkAttributes.href = href[1];
      }
      const modifiedLink = link.replace(/<a\s[^>]*>/, `<a ${Object.keys(linkAttributes).map((key) => `${key}="${linkAttributes[key]}"`).join(' ')}`);
      children = children.replace(link, modifiedLink);
    });
  }

  return (
    <div id={id}>
      <div data-testid={testId}>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          aria-label={message}
        />
      </div>
      {children}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, PropsWithChildren } from 'react';
import { sanitize } from 'dompurify';

interface LinkAttributes {
  href?: string;
  target?: string;
}

interface InlineElementAttributes {
  'data-testid'?: string;
}

interface Props extends PropsWithChildren<{
  message?: string;
}> {
  id?: string;
  testId?: string;
}

const MyComponent: FC<Props> = ({ children, message, id, testId }) => {
  const sanitizedMessage = sanitize(message || '', {
    ALLOWED_TAGS: ['b', 'i', 'u', 'a'],
    ALLOWED_ATTRS: {
      a: ['href', 'target'],
      '*': ['data-testid'],
    },
  });

  const linkAttributes: LinkAttributes = {
    target: '_blank', // Default target for links
  };

  // Extract links from sanitizedMessage and apply attributes
  const links = sanitizedMessage.match(/<a\s[^>]*>([^<]+)<\/a>/g);
  if (links) {
    links.forEach((link) => {
      const href = link.match(/href="([^"]+)"/);
      if (href) {
        linkAttributes.href = href[1];
      }
      const modifiedLink = link.replace(/<a\s[^>]*>/, `<a ${Object.keys(linkAttributes).map((key) => `${key}="${linkAttributes[key]}"`).join(' ')}`);
      children = children.replace(link, modifiedLink);
    });
  }

  return (
    <div id={id}>
      <div data-testid={testId}>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          aria-label={message}
        />
      </div>
      {children}
    </div>
  );
};

export default MyComponent;