import React, { FC, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const { locale } = useContext(AppContext);

  // Validate the message prop before rendering
  if (!message) {
    return <div>Error: Missing message prop</div>;
  }

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a', 'span'],
    ALLOWED_ATTRS: {
      'a': ['href', 'target', 'rel'],
    },
    FILTER_CSS_CLASS_ATTRS: true,
    FILTER_PROTOCOLS: {
      protocols: ['http:', 'https:'],
      protocolsAttr: ['href'],
    },
  });

  // Add a role and aria-label for accessibility
  sanitizedMessage = (
    <div role="alert" aria-label={locale === 'en' ? 'Message' : 'Mensaje'}>
      {sanitizedMessage}
    </div>
  );

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, ReactNode, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './AppContext';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const { locale } = useContext(AppContext);

  // Validate the message prop before rendering
  if (!message) {
    return <div>Error: Missing message prop</div>;
  }

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'a', 'span'],
    ALLOWED_ATTRS: {
      'a': ['href', 'target', 'rel'],
    },
    FILTER_CSS_CLASS_ATTRS: true,
    FILTER_PROTOCOLS: {
      protocols: ['http:', 'https:'],
      protocolsAttr: ['href'],
    },
  });

  // Add a role and aria-label for accessibility
  sanitizedMessage = (
    <div role="alert" aria-label={locale === 'en' ? 'Message' : 'Mensaje'}>
      {sanitizedMessage}
    </div>
  );

  return sanitizedMessage;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;