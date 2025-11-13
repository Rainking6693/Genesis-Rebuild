import React, { FunctionComponent, ReactNode, Key, memo } from 'react';
import { useId } from '@reach/auto-id';
import { sanitizeHtml } from 'sanitize-html';
import { Fragment } from 'react';

interface Props {
  message: string;
}

/**
 * MyComponent - A React functional component that displays a sanitized message.
 * It uses the sanitize-html package to prevent XSS attacks, the memo HOC to optimize performance,
 * Reach's useId hook for auto-generating unique ID's for accessibility purposes, and Fragment for better performance.
 */
const MyComponent: FunctionComponent<Props> = ({ message }) => {
  const id = useId();
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['div', 'span', 'a', 'Fragment'],
    allowedAttributes: {
      '*': ['id', 'class'],
      'a': ['href', 'id', 'class', 'target', 'rel', 'aria-label'],
    },
  });

  // Extract links and non-link elements separately for better maintainability
  const links = sanitizedMessage.match(/<a(.*?)>/g)?.map((link) => (
    <a key={id + '_link'} {...(link.match(/aria-label=['"]([^'"]+)['"]/i) ? { 'aria-label': RegExp.exec(link)[1] } : {})} {...(new DOMParser().parseFromString(link, 'text/html').attributes)}>
      {new DOMParser().parseFromString(link, 'text/html').textContent}
    </a>
  ));

  const nonLinks = sanitizedMessage.replace(/<a(.*?)>/g, '').replace(/<\/a>/g, '').replace(/<(.*?)>/g, (tag) => (
    tag.startsWith('a') ? (
      links
    ) : (
      <Fragment key={id + '_span'}>{tag}</Fragment>
    )
  ));

  return (
    <div id={id} aria-labelledby={id}>
      {nonLinks}
      {links}
    </div>
  );
};

export default memo(MyComponent);

import React, { FunctionComponent, ReactNode, Key, memo } from 'react';
import { useId } from '@reach/auto-id';
import { sanitizeHtml } from 'sanitize-html';
import { Fragment } from 'react';

interface Props {
  message: string;
}

/**
 * MyComponent - A React functional component that displays a sanitized message.
 * It uses the sanitize-html package to prevent XSS attacks, the memo HOC to optimize performance,
 * Reach's useId hook for auto-generating unique ID's for accessibility purposes, and Fragment for better performance.
 */
const MyComponent: FunctionComponent<Props> = ({ message }) => {
  const id = useId();
  const sanitizedMessage = sanitizeHtml(message, {
    allowedTags: ['div', 'span', 'a', 'Fragment'],
    allowedAttributes: {
      '*': ['id', 'class'],
      'a': ['href', 'id', 'class', 'target', 'rel', 'aria-label'],
    },
  });

  // Extract links and non-link elements separately for better maintainability
  const links = sanitizedMessage.match(/<a(.*?)>/g)?.map((link) => (
    <a key={id + '_link'} {...(link.match(/aria-label=['"]([^'"]+)['"]/i) ? { 'aria-label': RegExp.exec(link)[1] } : {})} {...(new DOMParser().parseFromString(link, 'text/html').attributes)}>
      {new DOMParser().parseFromString(link, 'text/html').textContent}
    </a>
  ));

  const nonLinks = sanitizedMessage.replace(/<a(.*?)>/g, '').replace(/<\/a>/g, '').replace(/<(.*?)>/g, (tag) => (
    tag.startsWith('a') ? (
      links
    ) : (
      <Fragment key={id + '_span'}>{tag}</Fragment>
    )
  ));

  return (
    <div id={id} aria-labelledby={id}>
      {nonLinks}
      {links}
    </div>
  );
};

export default memo(MyComponent);