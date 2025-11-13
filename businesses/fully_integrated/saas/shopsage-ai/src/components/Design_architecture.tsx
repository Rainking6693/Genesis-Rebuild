import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { classNames } from './utils';
import styles from './MyComponent.module.css';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [error, setError] = useState(false);
  const sanitizedMessage = useMemo(() => {
    try {
      return DOMPurify.sanitize(message);
    } catch (error) {
      setError(true);
      console.error('Error sanitizing HTML:', error);
      return '';
    }
  }, [message]);

  if (!sanitizedMessage || sanitizedMessage.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(styles.myComponent, {
        [styles.error]: error,
      })}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

MyComponent.sanitizeHTML = (html: string) => DOMPurify.sanitize(html);

export default MyComponent;

// Adding a utility function for classNames
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

In this version, I've added a state variable `error` to track if an error occurred during sanitization. This allows us to add a class for styling the component when an error occurs. I've also added an `aria-label` for accessibility purposes, and created a utility function `classNames` for better maintainability when dealing with class names.