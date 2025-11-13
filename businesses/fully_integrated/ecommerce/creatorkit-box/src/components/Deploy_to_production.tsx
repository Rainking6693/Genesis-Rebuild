import React, { FC, useState, useEffect, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate the message prop
    const isValidMessage = validateMessage(message);
    if (!isValidMessage) {
      setError('Invalid message provided');
    }
  }, [message]);

  const validateMessage = (message: string) => {
    // Add your validation logic here
    // For example, you can check if the message is not empty, not too long, or contains specific characters
    const minLength = 5;
    const maxLength = 255;
    const invalidChars = /[<>&'"]/;

    if (message.trim() === '' || message.length < minLength || message.length > maxLength || invalidChars.test(message)) {
      return false;
    }

    return true;
  };

  if (error) {
    return <div role="alert">Error: {error}</div>;
  }

  return <div {...rest} dangerouslySetInnerHTML={{ __html: message }} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, useState, useEffect, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate the message prop
    const isValidMessage = validateMessage(message);
    if (!isValidMessage) {
      setError('Invalid message provided');
    }
  }, [message]);

  const validateMessage = (message: string) => {
    // Add your validation logic here
    // For example, you can check if the message is not empty, not too long, or contains specific characters
    const minLength = 5;
    const maxLength = 255;
    const invalidChars = /[<>&'"]/;

    if (message.trim() === '' || message.length < minLength || message.length > maxLength || invalidChars.test(message)) {
      return false;
    }

    return true;
  };

  if (error) {
    return <div role="alert">Error: {error}</div>;
  }

  return <div {...rest} dangerouslySetInnerHTML={{ __html: message }} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;