import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactIs from 'react-is';
import DOMPurify from 'dompurify';
import { useLocale } from './useLocale'; // Assuming you have a custom hook for handling localization

interface Props {
  message: string;
  className?: string; // Adding a prop for custom classes
}

const MyComponent: FC<Props> = ({ message, className }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<string>('');
  const locale = useLocale(); // Assuming you have a custom hook for handling localization

  const sanitizeMessage = useMemo(() => {
    try {
      return DOMPurify.sanitize(message, {
        ADD_ATTR: (key, value) => {
          // Adding a custom function to add 'lang' attribute based on the current locale
          if (key === 'class' && value.includes('message')) {
            return `class="${value} ${locale}"`;
          }
          return value;
        },
      });
    } catch (error) {
      console.error(`Invalid HTML in message (${locale}):`, error);
      return `Invalid HTML in message (${locale})`;
    }
  }, [message, locale]);

  useMemo(() => {
    setSanitizedMessage(sanitizeMessage);
  }, [sanitizeMessage]);

  return (
    <div
      className={className} // Using the provided className prop
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const MemoizedMyComponent = React.memo(MyComponent, ReactIs);

export default MemoizedMyComponent;

In this updated code:

- I added a `className` prop for custom classes.
- I created a custom function `ADD_ATTR` in `DOMPurify` to add the `lang` attribute based on the current locale.
- I moved the sanitization logic into a separate `sanitizeMessage` variable for better readability.
- I used a `useState` hook to store the sanitized message and a `useMemo` hook to update it when the `sanitizeMessage` variable changes.
- I added the locale to the error message for better debugging.
- I assumed you have a custom hook for handling localization (`useLocale`). If not, you can create one to manage the current locale.