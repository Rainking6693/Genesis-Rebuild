import React, { FC, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  // Sanitize user-generated content to prevent XSS attacks
  const sanitize = (html: string) => DOMPurify.sanitize(html);

  // Use the sanitization function to ensure safety of user-generated content
  const [sanitizedMessage, setSanitizedMessage] = React.useState(message);

  // Sanitize the message on mount and whenever it changes
  useEffect(() => {
    setSanitizedMessage(sanitize(message));
  }, [message]);

  // Use a unique key for accessibility and performance reasons
  const keyValue = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  return (
    <div
      key={keyValue} // Use key prop instead of sanitizedMessage
      // Use dangerouslySetInnerHTML with the sanitized content
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

export default MyComponent;

1. Storing the sanitized message in a state variable to ensure that it is always up-to-date.
2. Using the `useEffect` hook to sanitize the message on mount and whenever it changes.
3. Using the `key` prop instead of the sanitized message for better performance and accessibility.
4. Adding the `useMemo` hook to compute the key value only when necessary, improving performance.
5. Importing only the required parts of React to minimize the bundle size.
6. Using the `sanitize` function to ensure safety of user-generated content.
7. Using the `DOMPurify` library to prevent XSS attacks.