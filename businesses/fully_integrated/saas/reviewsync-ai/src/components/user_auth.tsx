import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type FunctionalComponent<P = {}> = FC<P>;

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  role?: 'alert' | 'error' | 'success';
  id?: string;
  children?: ReactNode;
};

const sanitizeMessage = (message: string): string => {
  // Implement a sanitization function to prevent XSS attacks
  // You can use a library like DOMPurify for this purpose
  // For simplicity, I've used a basic whitelist approach here
  const allowedChars = /^[\w\s.,!?:;(){}"'-]+$/;
  return message.replace(/<[^>]+>/gm, '').replace(/\n/g, ' ').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: FunctionalComponent<Props> = ({
  id,
  role = 'alert',
  children = sanitizeMessage('No message provided'),
  ...rest
}) => {
  const sanitizedMessage = sanitizeMessage(children as string);

  // Add aria-label for accessibility
  const ariaLabel = role === 'alert' ? 'Alert message' : role === 'error' ? 'Error message' : 'Success message';

  return (
    <div id={id} role={role} aria-label={ariaLabel} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type FunctionalComponent<P = {}> = FC<P>;

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message: string;
  role?: 'alert' | 'error' | 'success';
  id?: string;
  children?: ReactNode;
};

const sanitizeMessage = (message: string): string => {
  // Implement a sanitization function to prevent XSS attacks
  // You can use a library like DOMPurify for this purpose
  // For simplicity, I've used a basic whitelist approach here
  const allowedChars = /^[\w\s.,!?:;(){}"'-]+$/;
  return message.replace(/<[^>]+>/gm, '').replace(/\n/g, ' ').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: FunctionalComponent<Props> = ({
  id,
  role = 'alert',
  children = sanitizeMessage('No message provided'),
  ...rest
}) => {
  const sanitizedMessage = sanitizeMessage(children as string);

  // Add aria-label for accessibility
  const ariaLabel = role === 'alert' ? 'Alert message' : role === 'error' ? 'Error message' : 'Success message';

  return (
    <div id={id} role={role} aria-label={ariaLabel} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;