import React, { FC, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  className?: string; // Adding a new prop for custom classes
}

const MyComponent: FC<Props> = ({ message, className }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  // Sanitize user-generated messages to prevent XSS attacks
  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message));
  }, [message]);

  // Adding a check for empty message to prevent rendering an empty div
  if (!sanitizedMessage) return null;

  // Adding a class name prop to the div for styling or other purposes
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.defaultProps = {
  message: '',
  className: '', // Setting default className to an empty string
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string, // Making the className prop optional
};

export default MyComponent;

import React, { FC, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  className?: string; // Adding a new prop for custom classes
}

const MyComponent: FC<Props> = ({ message, className }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  // Sanitize user-generated messages to prevent XSS attacks
  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message));
  }, [message]);

  // Adding a check for empty message to prevent rendering an empty div
  if (!sanitizedMessage) return null;

  // Adding a class name prop to the div for styling or other purposes
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.defaultProps = {
  message: '',
  className: '', // Setting default className to an empty string
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string, // Making the className prop optional
};

export default MyComponent;