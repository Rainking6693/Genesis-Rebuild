import React, { FunctionComponent, ReactNode, Key, memo } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  message: string;
}

/**
 * MyComponent is a simple React component that displays a sanitized message.
 * It uses the sanitize-html library to prevent XSS attacks, handle errors,
 * and the memo higher-order component to prevent unnecessary re-renders.
 * This version also supports more HTML tags, improves accessibility, and adds
 * checks for empty or invalid messages.
 */
const MyComponent: FunctionComponent<Props> = ({ message }) => {
  if (!message) return null;

  try {
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ['div', 'span', 'a', 'strong', 'em', 'img', 'br', 'p'],
      allowedAttributes: {
        'div': ['class'],
        'span': ['class'],
        'a': ['href', 'class', 'title'],
        'img': ['src', 'alt', 'class'],
        'strong': [],
        'em': [],
        'br': [],
        'p': [],
      },
    });

    if (!sanitizedMessage) {
      console.error('Invalid HTML in sanitized message.');
      return <div>Invalid HTML in sanitized message.</div>;
    }

    return (
      <Fragment>
        <div key={message} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </Fragment>
    );
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return <div>Error sanitizing message: {error.message}</div>;
  }
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default memo(MyComponent);

import React, { FunctionComponent, ReactNode, Key, memo } from 'react';
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

interface Props {
  message: string;
}

/**
 * MyComponent is a simple React component that displays a sanitized message.
 * It uses the sanitize-html library to prevent XSS attacks, handle errors,
 * and the memo higher-order component to prevent unnecessary re-renders.
 * This version also supports more HTML tags, improves accessibility, and adds
 * checks for empty or invalid messages.
 */
const MyComponent: FunctionComponent<Props> = ({ message }) => {
  if (!message) return null;

  try {
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ['div', 'span', 'a', 'strong', 'em', 'img', 'br', 'p'],
      allowedAttributes: {
        'div': ['class'],
        'span': ['class'],
        'a': ['href', 'class', 'title'],
        'img': ['src', 'alt', 'class'],
        'strong': [],
        'em': [],
        'br': [],
        'p': [],
      },
    });

    if (!sanitizedMessage) {
      console.error('Invalid HTML in sanitized message.');
      return <div>Invalid HTML in sanitized message.</div>;
    }

    return (
      <Fragment>
        <div key={message} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </Fragment>
    );
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return <div>Error sanitizing message: {error.message}</div>;
  }
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.displayName = 'MyComponent';

export default memo(MyComponent);