import React, { FC, ReactNode, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<ReactNode>(null);

  useEffect(() => {
    if (message) {
      const sanitized = DOMPurify.sanitize(message);
      setSanitizedMessage(<div dangerouslySetInnerHTML={{ __html: sanitized }} />);
    }
  }, [message]);

  const fallback = <div>No message provided</div>;

  return sanitizedMessage || fallback;
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: PropTypes.string,
};

export default FunctionalComponent;

In this updated version, I've added the `DOMPurify` library to sanitize the input and prevent XSS attacks. I've also moved the sanitization logic into a `useEffect` hook to ensure that the component re-renders with the sanitized message when the `message` prop changes. Additionally, I've added TypeScript type annotations for the `ReactNode` return value and the `useState` hook.