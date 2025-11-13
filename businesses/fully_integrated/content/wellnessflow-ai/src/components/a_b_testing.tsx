import React, { FunctionComponent, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  id: string; // Add unique id for accessibility and testing purposes
  message: string;
}

const allowedTags = ['div', 'span', 'a', 'strong', 'em']; // Add more useful tags
const allowedAttributes = {
  'a': {
    href: true,
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
  },
  '*': {
    class: true,
    style: true,
  },
}; // Allow more attributes for better flexibility

const sanitize = (html: string) => sanitizeHtml(html, { allowedTags, allowedAttributes });

const MyComponent: FunctionComponent<Props> = ({ id, message }) => {
  const safeHtml: ReactNode = sanitize(message);

  // Add aria-label for screen readers
  const ariaLabel = `A/B test message ${id}`;

  return (
    <div>
      <span id={id} aria-label={ariaLabel}>
        {safeHtml}
      </span>
      {/* Add a key for performance and consistency */}
      <div key={id} />
    </div>
  );
};

MyComponent.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component with a unique key based on the id prop
export default React.memo((props: Props) => <MyComponent {...props} />);

import React, { FunctionComponent, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  id: string; // Add unique id for accessibility and testing purposes
  message: string;
}

const allowedTags = ['div', 'span', 'a', 'strong', 'em']; // Add more useful tags
const allowedAttributes = {
  'a': {
    href: true,
    target: '_blank',
    rel: ['noopener', 'noreferrer'],
  },
  '*': {
    class: true,
    style: true,
  },
}; // Allow more attributes for better flexibility

const sanitize = (html: string) => sanitizeHtml(html, { allowedTags, allowedAttributes });

const MyComponent: FunctionComponent<Props> = ({ id, message }) => {
  const safeHtml: ReactNode = sanitize(message);

  // Add aria-label for screen readers
  const ariaLabel = `A/B test message ${id}`;

  return (
    <div>
      <span id={id} aria-label={ariaLabel}>
        {safeHtml}
      </span>
      {/* Add a key for performance and consistency */}
      <div key={id} />
    </div>
  );
};

MyComponent.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component with a unique key based on the id prop
export default React.memo((props: Props) => <MyComponent {...props} />);