import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const sanitizeHtml = (html: string) => {
  try {
    const sanitized = DOMPurify.sanitize(html);
    if (!sanitized) {
      throw new Error('Invalid HTML');
    }
    return sanitized;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessage = sanitizeHtml(message);

  const memoizedComponent = useMemo(() => (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={`Message: ${message}`} // Adding aria-label for accessibility
    />
  ), [sanitizedMessage]);

  return memoizedComponent;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

In this updated code, I've added an `aria-label` attribute to the component for accessibility. If the sanitization fails, the function will catch the error and return an empty string instead of throwing an error. This makes the component more resilient and less likely to break when encountering invalid HTML. Additionally, I've separated the sanitization function for better maintainability.