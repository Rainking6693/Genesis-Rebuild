import React, { FC, ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types';
import { cleanHTML } from 'html-react-parser';

interface Props {
  message?: string;
}

type CleanedHTML = React.ReactElement | string;

const MyComponent: FC<Props> = ({ message }) => {
  // Validate and sanitize the message before rendering
  const sanitizedMessage = useMemo(() => {
    if (!message) return '';

    const cleanedMessage = cleanHTML(message, {
      allowAttributes: [],
      allowElements: [],
      onUnrecognizedTag: (tagName) => null,
      onUnrecognizedAttribute: (attrName, attrValue) => null,
    });

    // Check if the sanitized message is a valid HTML string
    if (typeof cleanedMessage !== 'string' && cleanedMessage.type !== 'string') {
      return <div>Invalid HTML</div>;
    }

    return cleanedMessage || '';
  }, [message]);

  // Use a Fragment to improve accessibility and maintainability
  let content: ReactNode;
  if (typeof sanitizedMessage === 'string') {
    content = <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  } else {
    content = sanitizedMessage;
  }

  return <>{content}</>;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(MyComponent);

export default MemoizedMyComponent;

// Add comments for better understanding of the component
// This component takes a message as a prop and renders it as HTML
// After validation and sanitization, the message is rendered safely
// Error handling and validation are added for the message prop
// A Fragment is used to improve accessibility and maintainability
// A check for invalid HTML is added to handle edge cases

import React, { FC, ReactNode, useMemo } from 'react';
import PropTypes from 'prop-types';
import { cleanHTML } from 'html-react-parser';

interface Props {
  message?: string;
}

type CleanedHTML = React.ReactElement | string;

const MyComponent: FC<Props> = ({ message }) => {
  // Validate and sanitize the message before rendering
  const sanitizedMessage = useMemo(() => {
    if (!message) return '';

    const cleanedMessage = cleanHTML(message, {
      allowAttributes: [],
      allowElements: [],
      onUnrecognizedTag: (tagName) => null,
      onUnrecognizedAttribute: (attrName, attrValue) => null,
    });

    // Check if the sanitized message is a valid HTML string
    if (typeof cleanedMessage !== 'string' && cleanedMessage.type !== 'string') {
      return <div>Invalid HTML</div>;
    }

    return cleanedMessage || '';
  }, [message]);

  // Use a Fragment to improve accessibility and maintainability
  let content: ReactNode;
  if (typeof sanitizedMessage === 'string') {
    content = <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  } else {
    content = sanitizedMessage;
  }

  return <>{content}</>;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(MyComponent);

export default MemoizedMyComponent;

// Add comments for better understanding of the component
// This component takes a message as a prop and renders it as HTML
// After validation and sanitization, the message is rendered safely
// Error handling and validation are added for the message prop
// A Fragment is used to improve accessibility and maintainability
// A check for invalid HTML is added to handle edge cases