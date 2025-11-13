import React, { FC, Key } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  isSanitized?: boolean;
}

const MyComponent: FC<Props> = ({ message, isSanitized = false }) => {
  // Sanitize user-generated content if 'isSanitized' is false
  const sanitizedMessage = isSanitized ? message : DOMPurify.sanitize(message);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} key={message as Key} />;
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  isSanitized: PropTypes.bool,
};

export default MyComponent;

In this updated version:

1. I've added the `DOMPurify` library for sanitizing user-generated content to prevent XSS attacks.
2. I've added an optional `isSanitized` prop to indicate if the message has been sanitized. This allows for better control over the sanitization process.
3. I've added a unique key to each component based on the message for React's reconciliation process. I've used the `Key` type from React for the key prop.
4. I've made the `isSanitized` prop optional with a default value of `false`.
5. I've imported `FC` from 'react' instead of using the alias 'FC'.
6. I've cast the `message` prop to the `Key` type for type safety.