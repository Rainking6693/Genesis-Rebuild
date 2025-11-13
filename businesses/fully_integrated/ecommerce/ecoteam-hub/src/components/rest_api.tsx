import React, { Key } from 'react';
import { IMyComponentProps } from './types';
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string, fallback: string) => {
  try {
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return fallback;
  }
};

export interface IMyComponentProps {
  message: string;
  title?: string;
  className?: string;
  maxLength?: number;
}

const MyComponent: React.FC<IMyComponentProps> = ({
  message,
  title,
  className,
  maxLength,
}) => {
  const sanitizedMessage = sanitizeHTML(message, '');

  if (sanitizedMessage.length > (maxLength || Infinity)) {
    sanitizedMessage.length = maxLength || Infinity;
  }

  return (
    <div
      key={title || message}
      className={className}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
};

MyComponent.defaultProps = {
  message: '',
  title: '',
  className: '',
  maxLength: Infinity,
};

export default MyComponent;

import React, { Key } from 'react';
import { IMyComponentProps } from './types';
import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string, fallback: string) => {
  try {
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return fallback;
  }
};

export interface IMyComponentProps {
  message: string;
  title?: string;
  className?: string;
  maxLength?: number;
}

const MyComponent: React.FC<IMyComponentProps> = ({
  message,
  title,
  className,
  maxLength,
}) => {
  const sanitizedMessage = sanitizeHTML(message, '');

  if (sanitizedMessage.length > (maxLength || Infinity)) {
    sanitizedMessage.length = maxLength || Infinity;
  }

  return (
    <div
      key={title || message}
      className={className}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
};

MyComponent.defaultProps = {
  message: '',
  title: '',
  className: '',
  maxLength: Infinity,
};

export default MyComponent;