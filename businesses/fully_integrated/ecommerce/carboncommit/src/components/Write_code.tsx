import React, { FC, Key, ReactNode } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    message: {
      fontSize: '1rem',
      lineHeight: '1.5',
      marginBottom: '1rem',
      // Adding ARIA attributes for accessibility
      '&[data-testid="my-component"]': {
        // Adding role for better understanding of the component's purpose
        role: 'alert',
        // Adding aria-label for screen readers
        'aria-label': 'Message',
      },
    },
  })
);

const sanitizeHtml = (html: string) => {
  // Using DOMPurify for sanitizing HTML content
  // (You should use a library like DOMPurify for this)
  const sanitized = DOMPurify.sanitize(html);
  return sanitized;
};

const MyComponent: FC<Props> = ({ message }) => {
  const classes = useStyles();
  const sanitizedMessage = sanitizeHtml(message || '');

  // Adding a key prop to the div for better React performance
  const keyValue = message || '';

  // Returning null if the sanitized message is empty to avoid rendering an empty div
  if (!sanitizedMessage) return null;

  return (
    <div className={classes.message} data-testid="my-component" key={keyValue}>
      <div
        // Using React.isValidElement to ensure the sanitizedMessage is a valid React element
        // (This helps with edge cases where sanitizeHtml might return an invalid React element)
        dangerouslySetInnerHTML={{ __html: React.isValidElement(sanitizedMessage) ? sanitizedMessage.props.dangerouslySetInnerHTML.__html : sanitizedMessage }}
      />
    </div>
  );
};

export default MyComponent;

import React, { FC, Key, ReactNode } from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    message: {
      fontSize: '1rem',
      lineHeight: '1.5',
      marginBottom: '1rem',
      // Adding ARIA attributes for accessibility
      '&[data-testid="my-component"]': {
        // Adding role for better understanding of the component's purpose
        role: 'alert',
        // Adding aria-label for screen readers
        'aria-label': 'Message',
      },
    },
  })
);

const sanitizeHtml = (html: string) => {
  // Using DOMPurify for sanitizing HTML content
  // (You should use a library like DOMPurify for this)
  const sanitized = DOMPurify.sanitize(html);
  return sanitized;
};

const MyComponent: FC<Props> = ({ message }) => {
  const classes = useStyles();
  const sanitizedMessage = sanitizeHtml(message || '');

  // Adding a key prop to the div for better React performance
  const keyValue = message || '';

  // Returning null if the sanitized message is empty to avoid rendering an empty div
  if (!sanitizedMessage) return null;

  return (
    <div className={classes.message} data-testid="my-component" key={keyValue}>
      <div
        // Using React.isValidElement to ensure the sanitizedMessage is a valid React element
        // (This helps with edge cases where sanitizeHtml might return an invalid React element)
        dangerouslySetInnerHTML={{ __html: React.isValidElement(sanitizedMessage) ? sanitizedMessage.props.dangerouslySetInnerHTML.__html : sanitizedMessage }}
      />
    </div>
  );
};

export default MyComponent;